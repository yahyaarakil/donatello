import threading
from .state import State

class Moving(State):
    @staticmethod
    def start(meta_state):
        meta_state.is_moving = False

    @staticmethod
    def update(meta_state):
        pass
