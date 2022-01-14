from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, Method, Router, Request, Response, deserialize
import time, logging
from scheduling import Scheduler

class Donatello:
    def __init__(self) -> None:
        # self.fsm = FiniteStateMachine() # ASYNC
        # self.com = Communication() # ASYNC
        self.sch = Scheduler() # ASYNC
        