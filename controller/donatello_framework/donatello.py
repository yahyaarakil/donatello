from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, Method, Router, Request, Response, deserialize
import time, logging

class Donatello:
    def __init__(self) -> None:
        logging.basicConfig(level='DEBUG')
        self.fsm = FiniteStateMachine() # ASYNC
        self.com = Communication() # ASYNC
        self.com.makeRequest(Request(Method.POST, 'TELEMETRY.GPS', { 'long': 46, 'lat': 50 }))
