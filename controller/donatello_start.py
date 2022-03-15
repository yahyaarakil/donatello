from communications import Router, Request, Method, Message
from donatello_framework import Donatello
from missions import Mission, MissionManager
from mavlink_module import Ardu
import logging, time


# class DDonatello(Donatello):
#     def __init__(self) -> None:
#         super().__init__()
#         self.msn = MissionManager()
#         # self.fsmRouter = Router()
#         # self.fsmRouter.post('state.awake', self.fsm.awake)
#         # self.com.use('fsm', self.fsmRouter)

#         self.scheduleMissionRouter = Router()
#         self.scheduleMissionRouter.post('now', self.msn.start_new_mission)
#         self.scheduleMissionRouter.post('schedule', self.msn.schedule_new_mission)
#         self.scheduleMissionRouter.get('missions', self.msn.get_all_mission)
#         self.scheduleMissionRouter.get('current', self.msn.get_current_mission)
#         self.scheduleMissionRouter.get('', self.msn.get_mission_by_id)
#         self.com.use('mission', self.scheduleMissionRouter)

if __name__ == "__main__":
    logging.basicConfig(level="DEBUG")
    ardu = Ardu()
    # ardu.arm()
    # ardu.set_home((35.36316936246472, 33.11961807818279, 50))
    # # ardu.return_to_launch()
    # # ardu.change_mode('GUIDED')
    # ardu.change_mode('RTL')
    # ardu.get_position()

    # ardu.go_to_global((35.363766620836216, 33.11955332648672, 0))
    # ardu.set_fence(((35.36316936246472, 33.11961807818279, 50), ))
    # donatello = DDonatello()
    # donatello.com.makeRequest(Request(Method.POST, 'mission.now', {'mission': 'none'}))
    # # donatello.com.makeRequest(Request(Method.GET, 'mission.current', {'mission': 'none'}))
