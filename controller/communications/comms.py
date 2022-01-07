import websocket
import threading
import time
import rel
import logging

from .conf import *
from .message import MessageType, Message

class Communication:
    def __init__(self, recv_callback=None):
        self._recv_callback = recv_callback
        rel.safe_read()
        logging.info('Establishing connection to server')
        self.ws = websocket.WebSocketApp(f'ws://{SERVER_ADDRESS}:{SERVER_PORT}',
                                    on_open=self.on_open,
                                    on_message=self.on_message,
                                    on_error=self.on_error,
                                    on_close=self.on_close)
        self.listen_thread = threading.Thread(target=self.listen)
        self.listen_thread.start()

    def on_message(self, ws, message):
        if self._recv_callback:
            self._recv_callback(Message.deserialize(message))

    def on_error(self, ws, error):
        logging.error(error)

    def on_close(self, ws, close_status_code, close_msg):
        logging.info('Closing connection to server')

    def on_open(self, ws):
        logging.info('Established connection to server')

    def listen(self):
        try:
            logging.info('Listening to messages from server')
            self.ws.run_forever(dispatcher=rel)  # Set dispatcher to automatic reconnection
            rel.dispatch()
        except KeyboardInterrupt:
            pass

    def sendMessage(self, message: Message):
        if type(message) != Message:
            logging.error(f'Message of type {type(message)} cannot be sent, use {Message} instead')
            return
        self.ws.send(message.serialize())

    def __del__(self):
        self.ws.close()
