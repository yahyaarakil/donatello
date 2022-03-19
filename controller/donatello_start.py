from communications import Router, Request, Method, Message
from donatello_framework import Donatello
from missions import Mission, MissionManager
import logging, time, threading
from enum import Enum
from config import GEN

class State(Enum):
    ASLEEP = 'ASLEEP'


class DDonatello(Donatello):
    def __init__(self) -> None:
        super().__init__()
        self._state = State.ASLEEP
        self.e = threading.Event()
        self.msn = MissionManager()

        self._update_dict = {
            State.ASLEEP: self._sleep_update,
        }
        self._target_frame_time = 1/GEN['TARGET_REFRESH_RATE']
        self._refresh_counter = 0

        self.scheduleMissionRouter = Router()
        self.scheduleMissionRouter.post('now', self.msn.start_new_mission)
        self.scheduleMissionRouter.post('schedule', self.msn.schedule_new_mission)
        self.scheduleMissionRouter.get('missions', self.msn.get_all_mission)
        self.scheduleMissionRouter.get('current', self.msn.get_current_mission)
        self.scheduleMissionRouter.get('', self.msn.get_mission_by_id)
        self.com.use('mission', self.scheduleMissionRouter)

        self.com.post('command.stop',
            lambda req, res: (
                res.status(200).text('Stopped'),
                self.stop()
            )
        )

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value: State):
        self.logger.info(f'State: {self._state}')
        self._state = value

    def _sleep_update(self):
        self.logger.info('Sleeping...')
        # self.e.clear()
        # self.e.wait()

    def update(self):
        start_time = time.time()
        self._update_dict[self.state]()

        frame_time = time.time() - start_time
        if frame_time < self._target_frame_time:
            # print('SLEEPING FOR', )
            time.sleep(self._target_frame_time - frame_time)

        frame_time = time.time() - start_time

        self._refresh_counter += 1
        if self._refresh_counter > 240:
            self.logger.info(f'Refresh Rate: {1.0 / (frame_time)} Hz') # FPS = 1 / time to process loop
            self._refresh_counter = 0


if __name__ == "__main__":
    try:
        logging.basicConfig(level="DEBUG")

        # start
        donatello = DDonatello()

        donatello.msn.run_mission(
            Mission(
                pattern=[
                    (35.364147, 33.118160),
                    (35.364391, 33.119475),
                    (35.363998, 33.120464)
                ]
            )
        )

        # update
        while True:
            donatello.update()

        donatello.com.makeRequest(Request(Method.POST, 'command.stop', {}))
    except Exception as e:
        donatello.logger.error(e.with_traceback())

    # donatello.com.makeRequest(Request(Method.POST, 'mission.now', {'mission': 'none'}))
    # # donatello.com.makeRequest(Request(Method.GET, 'mission.current', {'mission': 'none'}))
