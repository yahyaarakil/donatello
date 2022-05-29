from datetime import datetime
from communications import Router, Request, Method, Message
from donatello_framework import Donatello
from missions import Mission, MissionManager
import logging, time, threading
from states import *
from config import GEN, MOV
import pickle, copy
import numpy as np

state_translation = {
    'rtl' : State.RTL,
    'idle' : State.IDLE,
    'manual' : State.IDLE,
}

class DDonatello(Donatello):
    def load_settings(self):
        try:
            self.logger.info('Loading settings')
            with open('settings.bin', 'r') as f:
                self.settings = pickle.load(f)
        except FileNotFoundError:
            self.logger.info('No settings file found, loading defaults')
            from settings import settings as SETTINGS
            self.settings = copy.deepcopy(SETTINGS)

    def __init__(self) -> None:
        self.logger = logging.getLogger('DONATELLO')
        self.load_settings()
        self.flags = {
            'CRITICAL': 0,
            'SERVER': False,
            'MAVLINK': False,
            'STUCK': False,
            'COLLIDED': False,
            'SOLAR': False,
        }
        super().__init__()
        self._state = State.ASLEEP
        self._mission_state = MissionState.IDLE
        self.e = threading.Event()
        self.msn = MissionManager(self)

        self._update_dict = {
            State.ASLEEP: self._sleep_update,
            State.IN_MISSION: self._mission_update,
            State.RTL: self._rtl_update,
        }
        self._mission_update_dict = {
            MissionState.IDLE: self._idle_update,
            MissionState.MOVING: self._moving_update,
        }
        self._target_frame_time = 1/GEN['TARGET_REFRESH_RATE']
        self._refresh_counter = 0

        def change_mode(mode):
            try:
                mode = mode.lower()
                if mode != 'rtl':
                    self.ardu.change_mode(mode.upper())
                else:
                    self.ardu.arm()
                    self.ardu.return_to_launch()
                    self.target = self.ardu.home
                self.state = state_translation[mode]
            except:
                print("ERR")

        self.scheduleMissionRouter = Router()

        # implement now
        self.scheduleMissionRouter.post('schedule', self.msn.schedule_new_mission) # done
        self.scheduleMissionRouter.get('missions', self.msn.get_all_mission) # done
        self.scheduleMissionRouter.get('current', self.msn.get_current_mission) # done
        self.scheduleMissionRouter.post('mode', lambda req, res: change_mode(req.body['mode']))

        # implement later
        self.scheduleMissionRouter.get('', self.msn.get_mission_by_id)
        self.com.use('mission', self.scheduleMissionRouter)

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value: State):
        self._state = value
        if value == State.ASLEEP:
            time.sleep(5)
            self.ardu.disarm()
        self.logger.info(f'State: {self._state}')

    @property
    def mission_state(self):
        return self._mission_state

    @mission_state.setter
    def mission_state(self, value: State):
        self._mission_state = value
        self.logger.info(f'Mission State: {self._mission_state}')

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value: State):
        self._target = np.array(value)

    def _sleep_update(self):
        self.logger.info('Sleeping...')
        self.e.clear()
        self.e.wait()

    def _awake(self):
        self.logger.info('Waking up')
        self.state = State.IDLE
        self.e.set()

    def _mission_update(self):
        self._mission_update_dict[self.mission_state]()

    def _idle_update(self):
        if len(self.msn.current_mission.path) > 0:
            self.target = self.msn.current_mission.path.pop(0)
            self.ardu.go_to_global(self.target)
            self.mission_state = MissionState.MOVING
        else:
            self.logger.info('Finished pattern')
            self.msn.end_current_mission()

    def wait_to_reach_target(self):
        pos = self.ardu.get_position()
        distance = np.sum(np.square(pos[0:2] - self.target[0:2]))
        # self.logger.debug('POS:  ', pos)
        # self.logger.debug('TARGET:  ', self.target)
        # self.logger.debug('DISTANCE:  ', distance)
        return distance < MOV['STOPPING_DISTANCE']

    def _moving_update(self):
        # calc distance
        if self.wait_to_reach_target():
            self.mission_state = MissionState.IDLE

    def _rtl_update(self):
        # calc distance
        if self.wait_to_reach_target():
            self.state = State.ASLEEP

    def update(self):
        start_time = time.time()
        self._update_dict.get(self.state, self._idle_update)()

        frame_time = time.time() - start_time
        if frame_time < self._target_frame_time:
            time.sleep(self._target_frame_time - frame_time)
        frame_time = time.time() - start_time

        self._refresh_counter += 1
        if self._refresh_counter > 5:
            self.logger.info(f'Refresh Rate: {1.0 / (frame_time)} Hz') # FPS = 1 / time to process loop
            self.logger.info(f'Battery: {self.ardu.get_battery_percentage()}%') # FPS = 1 / time to process loop
            self._refresh_counter = 0


if __name__ == "__main__":
    try:
        logging.basicConfig(level="DEBUG")
        donatello = DDonatello()

        # donatello.msn.run_mission(
        #     Mission(
        #         pattern=[
        #             (35.364147, 33.118160),
        #             (35.364391, 33.119475),
        #             (35.363998, 33.120464)
        #         ]
        #     )
        # )
        # donatello.com.makeRequest(Request(Method.POST, 'mission.schedule', {
        #     'pattern': [
        #         (35.364147, 33.118160),
        #         (35.364391, 33.119475),
        #         (35.363998, 33.120464)
        #     ],
        #     'time': datetime.timestamp(datetime.now()) + 15
        # }))

        # update
        while True:
            donatello.update()

        # donatello.com.makeRequest(Request(Method.POST, 'command.stop', {}))
    except Exception as e:
        pass

    # donatello.com.makeRequest(Request(Method.POST, 'mission.now', {'mission': 'none'}))
    # # donatello.com.makeRequest(Request(Method.GET, 'mission.current', {'mission': 'none'}))
