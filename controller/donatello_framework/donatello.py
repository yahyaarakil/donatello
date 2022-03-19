from communications import Communication, Message, Method, Router, Request, Response, deserialize
import time, logging
from mavlink_module import Ardu
from scheduling import Scheduler

class Donatello:
    def __init__(self) -> None:
        self.logger = logging.getLogger('DONATELLO')
        self.com = Communication() # ASYNC
        self.sch = Scheduler() # ASYNC
        self.ardu = Ardu() # SYNC!

    def stop(self):
        self.logger.info('Stopping Donatello')
        self.com.stop()
        self.sch.stop()