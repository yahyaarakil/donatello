from finite_state_machine.state_enums import State
from .mission import Mission
from finite_state_machine import FiniteStateMachine, MetaState

class MissionManager:
    def __init__(self) -> None:
        self.missions = []

    def get_current_mission(self, req, res):
        pass

    def get_mission_by_id(self, req, res):
        pass

    def get_all_mission(self, req, res):
        pass

    def start_new_mission(self, req, res):
        res.status(200).text('test')
        print(req, res)

    def schedule_new_mission(self, req, res):
        pass

    def run_mission(self, mission: Mission, meta_state: MetaState):
        meta_state.path = mission.path
        meta_state.parent_fsm.state = State.Moving
    