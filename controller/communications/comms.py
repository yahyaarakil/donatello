import logging, time
import threading
from .conf import *
from .message import Message, Operation
from websocket import create_connection
import websocket

logger = logging.getLogger('COMMUNICATION')

class Communication:
    def __init__(self, recv_callback=None) -> None:
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

        self._recv_callback = recv_callback

    def sendMessage(self, message: Message):
        if not self.connected:
            logger.error(f'Unable to send message - No connection to server')
            return
        if type(message) != Message:
            logger.error(f'Unable to send message of type {type(message)}, use {Message} instead')
            return
        self.ws.send(message.serialize())

    def _listen(self):
        while self.listening:
            self._recvMessage()

    def _recvMessage(self):
        message =  self.ws.recv()
        if self._recv_callback:
            self._recv_callback(Message.deserialize(message))

    def __del__(self):
        if self.connected:
            self.ws.close()
            logger.info('Closed connection to server')
        self.listening = False
