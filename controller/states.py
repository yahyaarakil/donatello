from enum import Enum

class State(Enum):
    IDLE = 'IDLE'
    ASLEEP = 'ASLEEP'
    IN_MISSION = 'IN_MISSION'
    RTL = 'RTL'
    CHARGING = 'CHARGING'

class MissionState(Enum):
    IDLE = 'IDLE'
    MOVING = 'MOVING'
