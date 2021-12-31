from .states import State
from .states import OperationalState
from .state_functions import sleep as Sleep

import threading

class MetaState:
    def __init__(self):
        self.stopped = False

class FiniteStateMachine: 
    def __init__(self):
        self._state = State.SLEEP
        self._meta_state = MetaState()
        self._state_starts = {
            State.SLEEP: Sleep.start
        }
        self._state_updates = {
            State.SLEEP: Sleep.update
        }
        self.fsm_thread = threading.Thread(target=self.run, name='fsm_thread', daemon=True)
        self.fsm_thread.start()
        
    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        self._state = value
        self._state_starts[self._state](self.meta_state)
        
    @property
    def meta_state(self):
        return self._meta_state

    @meta_state.setter
    def meta_state(self, value):
        self._meta_state = value

    def _meta_update(self):
        pass

    def _update(self):
        self._state_updates[self.state](self.meta_state)

    def run(self):
        while not self.meta_state.stopped:
            self._meta_update()
            self._update()
