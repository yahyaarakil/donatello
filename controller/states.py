from enum import Enum

class State(Enum):
    ASLEEP = 'ASLEEP'
    IN_MISSION = 'IN_MISSION'

class MissionState(Enum):
    IDLE = 'IDLE'
    MOVING = 'MOVING'
