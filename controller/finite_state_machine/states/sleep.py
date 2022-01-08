import threading
from .state import State

class Sleep(State):
    @staticmethod
    def start(meta_state):
        meta_state.e.wait()

    @staticmethod
    def update(meta_state):
        Sleep.start(meta_state)
