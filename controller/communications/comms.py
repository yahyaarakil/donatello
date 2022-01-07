import logging, time
import websockets
import asyncio

from .conf import *
from .message import Message, MessageType

class Communication():

    def __init__(self, process_callback=None):
        self.process_callback = process_callback
        self._main_loop = asyncio.get_event_loop()

        self.connection = self.connect()
        self._stop_receive = False

        self._main_loop.run_until_complete(self._start_recv())

    def connect(self):
        connection = None
        while True:
            connection = self._main_loop.run_until_complete(self._establishConnection())
            if connection:
                break
            logging.info('Attempting to re-establish connection to server')
            time.sleep(10)
        return connection

    def __del__(self):
        logging.debug('Running communications destructor')
        self._stop_receive = True
        self._main_loop.run_until_complete(self._close_connection())
        logging.info('Closed connection to server')

    async def _close_connection(self):
        await self.connection.close()

    async def _establishConnection(self):
        try:
            connection = await websockets.connect(f'ws://{SERVER_ADDRESS}:{SERVER_PORT}')
            if connection.open:
                logging.info('Established connection to server')
                # retrieve token
                # await self.sendMessage('')
                return connection
        except:
            logging.error('Unable to establish connection to server')
            return None

    async def sendMessage(self, message: Message):
        if type(message) != Message:
            logging.error(f'Cannot send message of type {type(message)}, use {Message} instead')
            return
        try:
            await self.connection.send(message.serialize())
            logging.debug('Message sent')
        except Exception as e:
            logging.error('Unable to send message')
            logging.error(e)

    async def _start_recv(self):
        task = self._main_loop.create_task(self._receiveMessage())
        await asyncio.wait([task])
        return task

    async def _receiveMessage(self):
        logging.debug('Listening to messages from server')
        while True:
            try:
                message = await self.connection.recv()
                if self.process_callback:
                    self.process_callback(Message.deserialize(message))
                logging.debug('Received message from server')
            except websockets.exceptions.ConnectionClosed:
                logging.error('Lost connection to server')
                self.connect()
            if self._stop_receive:
                logging.debug('Stopping listening to messages from server')
                break

