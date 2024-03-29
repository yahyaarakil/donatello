from communications import Communication, Message, Method, Router, Request, Response, deserialize
import time, logging
from mavlink_module import Ardu
from scheduling import Scheduler

class Donatello:
    def __init__(self) -> None:
        self.com = Communication(self) # ASYNC
        self.sch = Scheduler() # ASYNC
        self.ardu = Ardu(self) # SYNC!

    def stop(self):
        self.logger.info('Stopping Donatello')
        self.com.stop()
        self.sch.stop()