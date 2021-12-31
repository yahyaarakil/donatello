from enum import Enum

class State(Enum):
    SLEEP = 0
    IDLE = 1
    OPERATIONAL = 2
    MANUAL = 3
    RADIO = 4
    CHARGE = 5
    RETURN = 6

class OperationalState(Enum):
    MOVING = 0
    STUCK = 1
    FULL = 2
    