from enum import Enum
from .states import *

class State(Enum):
    SLEEP = Sleep
    IDLE = Idle
    MOVING_AUTO = Moving
    MANUAL = 3
    RADIO = 4
    CHARGING = 5
    RETURN = 6
    