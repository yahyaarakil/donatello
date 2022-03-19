from communications import Router, Request, Method, Message
from donatello_framework import Donatello
from missions import Mission, MissionManager
import logging, time, threading


class DDonatello(Donatello):
    def __init__(self) -> None:
        super().__init__()
        self.msn = MissionManager()

        self.scheduleMissionRouter = Router()
        self.scheduleMissionRouter.post('now', self.msn.start_new_mission)
        self.scheduleMissionRouter.post('schedule', self.msn.schedule_new_mission)
        self.scheduleMissionRouter.get('missions', self.msn.get_all_mission)
        self.scheduleMissionRouter.get('current', self.msn.get_current_mission)
        self.scheduleMissionRouter.get('', self.msn.get_mission_by_id)
        self.com.use('mission', self.scheduleMissionRouter)

if __name__ == "__main__":
    logging.basicConfig(level="DEBUG")

    donatello = DDonatello()
    # e = threading.Event()
    # e.clear()
    # e.wait()


    donatello.msn.run_mission(
        Mission(
            pattern=[
                (35.364147, 33.118160),
                (35.364391, 33.119475),
                (35.363998, 33.120464)
            ]
        )
    )
    # donatello.com.makeRequest(Request(Method.POST, 'mission.now', {'mission': 'none'}))
    # # donatello.com.makeRequest(Request(Method.GET, 'mission.current', {'mission': 'none'}))
