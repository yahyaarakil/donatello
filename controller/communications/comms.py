import logging, time
import threading
from types import FunctionType
from config import COMS
from .message import Message, Request, Response, deserialize
from websocket import create_connection, _exceptions
from .router import Router

logger = logging.getLogger('COMMUNICATION')

class Communication(Router):
    def __init__(self) -> None:
        super().__init__()
        self.stopped = False
        self._request_lock = threading.Lock()
        self._awaiting_response = False
        self._response_callback = None
        self._request_queue = []
        if not self.establish_connection():
            threading.Thread(target=self._re_establish_connection).start()

    def establish_connection(self):
        logger.info('Establishing connection to server')
        self.listen_thread = None
        try:
            self.ws = create_connection(f"{COMS['WEB_PROTOCOL']}://{COMS['SERVER_ADDRESS']}:{COMS['SERVER_PORT']}")
            self.connected = True
            self.listen_thread = threading.Thread(target=self._listen)
            self.listen_thread.start()
            logger.info('Established connection to server')
            self._process_request_queue()
        except ConnectionRefusedError:
            logger.error('Unable to establish connection to server')
            self.connected = False
        return self.connected

    def _sendMessage(self, message: Message):
        self._request_lock.acquire()
        if not self.connected:
            logger.error(f'Unable to send message - No connection to server')
            self._request_lock.release()
            return False
        if not isinstance(message, Message):
            logger.error(f'Unable to send message of type {type(message)}, use {Message} instead')
            self._request_lock.release()
            return None # discard
        self.ws.send(message.serialize())
        self._request_lock.release()
        return True

    def _executeRequest(self, request: Request, callback: FunctionType = None):
        self._request_lock.acquire()
        self._awaiting_response = True
        self._response_callback = callback
        self._request_lock.release()
        send = self._sendMessage(request)
        self._request_lock.acquire()
        if send == False:
            self._awaiting_response = False
            self._response_callback = None
            self._request_queue.insert(0, (request, callback))
        logger.debug('Request made')
        self._request_lock.release()

    def makeRequest(self, request: Request, callback: FunctionType = None):
        if not self._awaiting_response:
            self._executeRequest(request, callback)
        else:
            self._request_lock.acquire()
            self._request_queue.append((request, callback))
            if len(self._request_queue) > MAX_REQ_QUEUE_SIZE:
                self._request_queue.pop(0)
            self._request_lock.release()

    def _re_establish_connection(self):
        logger.info(f'Attempting to re-establish connection to server')
        while not self.connected and not self.stopped:
            if self.establish_connection():
                break
            logger.info(f'Retrying in 10s')
            time.sleep(10)

    def _listen(self):
        while True:
            try:
                self._recvMessage()
            except _exceptions.WebSocketConnectionClosedException:
                self.connected = False
                logger.error(f'Dropped connection to server')
                break
        if not self.stopped:
            self._re_establish_connection()

    def _process_request_queue(self):
        self._request_lock.acquire()
        if len(self._request_queue) > 0:
            request, callback = self._request_queue.pop(0)
            self._executeRequest(request, callback)
        self._request_lock.release()

    def _recvMessage(self):
        message =  self.ws.recv()
        try:
            message = deserialize(message)
        except:
            logger.error(f'Received type non-message')
            return
        try:
            if isinstance(message, Request):
                logger.debug('Request received')
                response = Response()
                self.invoke(message, response) # tree (recursive)
                self._sendMessage(response)
            elif isinstance(message, Response):
                logger.debug('Response received')
                if self._response_callback:
                    logger.debug('Response callback invoked')
                    self._response_callback(message)
                    self._response_callback = None
                self._awaiting_response = False
                self._process_request_queue()
        except KeyError:
            logger.error(f'No function for method {message.method} on path {message.path}')
        except Exception as e:
            logger.fatal(f'Fatal error occured - {e}')

    def stop(self):
        if self.connected:
            self.ws.close()
            logger.info('Closed connection to server')
        self.stopped = True
        logger.info('Communications exiting')
