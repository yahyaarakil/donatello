from scheduling.scheduler import Scheduler
from .mission import Mission

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

    def run_mission(self, mission: Mission):
        print('Starting mission')
        self.current_mission = mission
        self.donatello.e.set()
    