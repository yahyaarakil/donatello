from .mission import Mission
from states import *
import logging

logger = logging.getLogger('MISSIONS')

class MissionManager:
    def __init__(self, donatello) -> None:
        self.missions = []
        self.mission_queue = []
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
        self.donatello.sch.schedule(self.start_scheduled_mission, (Mission(req.body['pattern']),)).once(req.body['time'])
        res.status(200).text('Mission Scheduled')

    def start_scheduled_mission(self, mission: Mission):
        if self.donatello.settings['missions']['schedule_override_behavior'] == 0:
            if self.donatello.state == State.IN_MISSION:
                logger.info('Skipping mission')
            elif self.donatello.state == State.ASLEEP or self.donatello.state == State.IDLE:
                self.run_mission(mission)
        elif self.donatello.settings['missions']['schedule_override_behavior'] == 1:
            self.mission_queue.append(mission)
        elif self.donatello.settings['missions']['schedule_override_behavior'] == 2:
            self.end_current_mission()
            self.run_mission(mission)

    def end_current_mission(self):
        logger.info('Ending current mission')
        if len(self.mission_queue) > 0 and self.donatello.settings['missions']['schedule_override_behavior'] == 1:
            self.donatello.state = State.IDLE
            self.run_mission(self.mission_queue.pop(0))
        else:
            self.donatello.target = self.donatello.ardu.home
            self.donatello.state = State.RTL
            self.donatello.ardu.return_to_launch()

    def run_mission(self, mission: Mission):
        logger.info('Starting mission')
        try:
            self.donatello.ardu.arm()
            self.donatello.ardu.change_mode('GUIDED')
        except:
            logger.error('Mission cannot start due to failure to arm')
            self.donatello.ardu.return_to_launch()
            return
        self.current_mission = mission
        self.donatello.state = State.IN_MISSION
        self.donatello.mission_state = MissionState.IDLE
        self.donatello.e.set()
        logger.info('Mission Started')
    