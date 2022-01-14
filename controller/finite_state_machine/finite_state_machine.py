from .state_enums import State
from .state_enums import OperationalState

import threading, logging

logger = logging.getLogger('FSM')

class MetaState:
    def __init__(self, parent_fsm):
        self.e = threading.Event()
        self.running = True
        self.parent_fsm = parent_fsm

class FiniteStateMachine:
    _instance = None
    def __init__(self):
        if FiniteStateMachine._instance != None:
            raise Exception("Finite State Machine is a Singleton!")
        FiniteStateMachine._instance = self
        self._state = State.SLEEP
        self._meta_state = MetaState(self)
        self.fsm_thread = threading.Thread(target=self.run)
        self.fsm_thread.start()
        
    def awake(self):
        logger.info('Waking up')
        self.meta_state.e.set()

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        logger.info(f'State: {value}')
        self._state = value
        self.state.value.start(self.meta_state)
        
    @property
    def meta_state(self):
        return self._meta_state

    def _meta_update(self):
        pass

    def _update(self):
        self.state.value.update(self.meta_state)

    def stop(self):
        self.meta_state.running = False
        self.fsm_thread.join()

    def run(self):
        while self.meta_state.running:
            self._meta_update()
            self._update()
