from communications import Router, Request, Method, Message
from donatello_framework import Donatello
from missions import Mission, MissionManager
import logging, time


class DDonatello(Donatello):
    def __init__(self) -> None:
        super().__init__()
        self.msn = MissionManager()
        # self.fsmRouter = Router()
        # self.fsmRouter.post('state.awake', self.fsm.awake)
        # self.com.use('fsm', self.fsmRouter)

        self.scheduleMissionRouter = Router()
        self.scheduleMissionRouter.post('now', self.msn.start_new_mission)
        self.scheduleMissionRouter.post('schedule', self.msn.schedule_new_mission)
        self.scheduleMissionRouter.get('missions', self.msn.get_all_mission)
        self.scheduleMissionRouter.get('current', self.msn.get_current_mission)
        self.scheduleMissionRouter.get('', self.msn.get_mission_by_id)
        self.com.use('mission', self.scheduleMissionRouter)

if __name__ == "__main__":
    # logging.basicConfig(level="DEBUG")
    donatello = DDonatello()
    donatello.com.makeRequest(Request(Method.POST, 'mission.now', {'mission': 'none'}))
    # donatello.com.makeRequest(Request(Method.GET, 'mission.current', {'mission': 'none'}))
