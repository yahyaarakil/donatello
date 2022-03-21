from .mission import Mission
from states import *

class MissionManager:
    def __init__(self, donatello) -> None:
        self.missions = []
        self.donatello = donatello

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
        self.donatello.sch.schedule(self.run_mission, (Mission(req.body['pattern']),)).once(req.body['time'])
        res.status(200).text('Mission Scheduled')

    def start_scheduled_mission(self):
        pass

    def run_mission(self, mission: Mission):
        print('Starting mission')
        self.current_mission = mission
        self.donatello.state = State.IN_MISSION
        self.donatello.e.set()
        try:
            self.donatello.ardu.arm()
        except:
            self.donatello.logger.error('Mission cannot continue due to failure to arm')
            self.donatello.ardu.return_to_launch()
    