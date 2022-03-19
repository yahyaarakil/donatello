from enum import Enum
from .states import Sleep, Idle, Starting

class State(Enum):
    STARTING = Starting
    SLEEP = Sleep
    IDLE = Idle
    IN_MISSION = 2
    MANUAL = 3
    RADIO = 4
    CHARGING = 5
    RETURN = 6
    