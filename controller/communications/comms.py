import logging, time
import threading
from .conf import *
from .message import Message, MessageType
from websocket import create_connection
import websocket

class Communication:
    def __init__(self, recv_callback=None) -> None:
        # websocket.enableTrace(True)
        logging.info('Establishing connection to server')
        self.ws = create_connection(f'ws://{SERVER_ADDRESS}:{SERVER_PORT}')
        self._recv_callback = recv_callback

        self.listening = True
        self.listen_thread = threading.Thread(target=self._listen)
        self.listen_thread.start()
        # self.ping_thread = threading.Thread(target=self._ping)
        # self.ping_thread.start()
        logging.info('Established connection to server')

    def sendMessage(self, message: Message):
        if type(message) != Message:
            logging.error(f'Unable to send message of type {type(message)}, use {Message} instead')
            return
        self.ws.send(message.serialize())

    def _listen(self):
        while self.listening:
            self._recvMessage()

    def _ping(self):
        while self.listening:
            time.sleep(PING_TIMER)
            self.ws.send('ping')

    def _recvMessage(self):
        message =  self.ws.recv()
        if self._recv_callback:
            self._recv_callback(Message.deserialize(message))

    def __del__(self):
        self.ws.close()
        self.listening = False
        logging.info('Closed connection to server')
