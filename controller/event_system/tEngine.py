from .engine import Engine
from .event import *
from communications import Operation
from finite_state_machine import State

class FilledEngine(Engine):
    def __init__(self, fsm) -> None:
        super().__init__()
        self.fsm = fsm
        self.add_event(
            Event({
                'name': 'Wake FSM from sleep',
                'conditions': [
                    Condition('FSM is asleep', lambda payload, fsm: fsm.state == State.SLEEP, (self.fsm,)),
                    Condition('New state is Idle', lambda payload: payload=='Idle'),
                ],
                'effects': [
                    Effect('Wake up FSM', lambda payload, fsm: fsm.awake(), (fsm, )),
                ]
            }),
            Trigger('FSM.state', Operation.POST)
        )
