import logging, time
import threading
from types import FunctionType
from .conf import *
from .message import Message, Request, Response, deserialize
from websocket import create_connection, _exceptions
from .router import Router

logger = logging.getLogger('COMMUNICATION')

class Communication(Router):
    def __init__(self) -> None:
        super().__init__()
        self._awaiting_response = False
        self._response_callback = None
        self._request_queue = []
        if not self.establish_connection():
            threading.Thread(target=self._re_establish_connection).start()

    def establish_connection(self):
        logger.info('Establishing connection to server')
        try:
            self.ws = create_connection(f'ws://{SERVER_ADDRESS}:{SERVER_PORT}')
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
        if not self.connected:
            logger.error(f'Unable to send message - No connection to server')
            return False
        if not isinstance(message, Message):
            logger.error(f'Unable to send message of type {type(message)}, use {Message} instead')
            return None # discard
        self.ws.send(message.serialize())
        return True

    def _executeRequest(self, request: Request, callback: FunctionType = None):
        self._awaiting_response = True
        self._response_callback = callback
        if self._sendMessage(request) == False:
            self._awaiting_response = False
            self._response_callback = None
            self._request_queue.insert(0, (request, callback))

    def makeRequest(self, request: Request, callback: FunctionType = None):
        if not self._awaiting_response:
            self._executeRequest(request, callback)
        else:
            self._request_queue.append((request, callback))
            if len(self._request_queue) > MAX_REQ_QUEUE_SIZE:
                self._request_queue.pop(0)

    def _re_establish_connection(self):
        logger.info(f'Attempting to re-establish connection to server')
        while not self.connected:
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
        self._re_establish_connection()

    def _process_request_queue(self):
        if len(self._request_queue) > 0:
            request, callback = self._request_queue.pop(0)
            self._executeRequest(request, callback)

    def _recvMessage(self):
        message =  self.ws.recv()
        try:
            message = deserialize(message)
        except:
            logger.error(f'Received type non-message')
            return
        try:
            if isinstance(message, Request):
                print(message)
                self.invoke(message.method, message.path, message)
            elif isinstance(message, Response):
                if self._response_callback:
                    self._response_callback(message)
                    self._response_callback = None
                self._awaiting_response = False
                self._process_request_queue()
        except KeyError:
            logger.error(f'No function for method {message.method} on path {message.path}')

    def stop(self):
        if self.connected:
            self.ws.close()
            logger.info('Closed connection to server')
        self.listen_thread.join()
