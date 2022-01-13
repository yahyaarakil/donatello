import logging, time
import threading
from types import FunctionType
from .conf import *
from .message import Message, Request, Response, deserialize
from websocket import create_connection
from .router import Router

logger = logging.getLogger('COMMUNICATION')

class Communication(Router):
    def __init__(self, recv_callback=None) -> None:
        super().__init__()
        # websocket.enableTrace(True)
        logger.info('Establishing connection to server')
        try:
            self.ws = create_connection(f'ws://{SERVER_ADDRESS}:{SERVER_PORT}')
            self.connected = True
            self.listening = True
            self.listen_thread = threading.Thread(target=self._listen)
            self.listen_thread.start()
            logger.info('Established connection to server')
        except ConnectionRefusedError:
            logger.error('Unable to establish connection to server')
            self.listening = False
            self.connected = False
        self._awaiting_response = False
        self._response_callback = None
        self._request_queue = []

    def _sendMessage(self, message: Message):
        if not self.connected:
            logger.error(f'Unable to send message - No connection to server')
            return
        if not isinstance(message, Message):
            logger.error(f'Unable to send message of type {type(message)}, use {Message} instead')
            return
        self.ws.send(message.serialize())

    def _executeRequest(self, request: Request, callback: FunctionType = None):
        self._awaiting_response = True
        self._response_callback = callback
        self._sendMessage(request)

    def makeRequest(self, request: Request, callback: FunctionType = None):
        if not self._awaiting_response:
            self._executeRequest(request, callback)
        else:
            self._request_queue.append((request, callback))

    def _listen(self):
        while self.listening:
            self._recvMessage()

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
                if len(self._request_queue) > 0:
                    request, callback = self._request_queue.pop()
                    self._executeRequest(request, callback)
        except KeyError:
            logger.error(f'No function for method {message.method} on path {message.path}')

    def stop(self):
        if self.connected:
            self.ws.close()
            logger.info('Closed connection to server')
        self.listening = False
