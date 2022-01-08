from .state_enums import State
from .state_enums import OperationalState

import threading

class MetaState:
    def __init__(self):
        self.e = threading.Event()
        self.stopped = False

class FiniteStateMachine:
    _instance = None
    def __init__(self):
        if FiniteStateMachine._instance != None:
            raise Exception("Finite State Machine is a Singleton!")
        FiniteStateMachine._instance = self
        self._state = State.SLEEP
        self._meta_state = MetaState()
        self.fsm_thread = threading.Thread(target=self.run, name='fsm_thread')
        self.fsm_thread.start()
        
    def awake(self):
        self.meta_state.e.set()

    @property
    def state(self):
        return self._state.value

    @state.setter
    def state(self, value):
        self._state = value
        self.state.start(self.meta_state)
        
    @property
    def meta_state(self):
        return self._meta_state

    @meta_state.setter
    def meta_state(self, value):
        self._meta_state = value

    def _meta_update(self):
        pass

    def _update(self):
        self.state.update(self.meta_state)

    def stop(self):
        self.meta_state.stopped = True
        self.fsm_thread.join()

    def run(self):
        while not self.meta_state.stopped:
            self._meta_update()
            self._update()
