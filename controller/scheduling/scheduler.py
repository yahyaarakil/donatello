import time, threading
from datetime import datetime
from types import FunctionType
from typing import Union
import logging

logger = logging.getLogger('SCHEDULER')

class Scheduler:
    _instance = None
    def __init__(self) -> None:
        if Scheduler._instance:
            raise Exception('Scheduler is a singleton')
        self.thread = threading.Thread(target=self._main_waiter)
        self._scheduled_tasks = []
        self._lock = threading.Lock()
        self._event = threading.Event()
        self.scheduler_running = True
        self.thread.start()
        Scheduler._instance = self

    def _main_waiter(self):
        while self.scheduler_running:
            self._lock.acquire()
            # acquire task and wait for it
            if len(self._scheduled_tasks) > 0:
                now = datetime.timestamp(datetime.now())
                next_task_time = self._scheduled_tasks[0][2]
                wait = next_task_time - now
                if wait > 0:
                    self._lock.release()
                    self._event.wait(wait)
                else:
                    job, args, time = self._scheduled_tasks.pop(0)
                    threading.Thread(target=job, args=args).start()
                    self._lock.release()
            else:
                self._lock.release()
                self._event.wait()

    def stop(self):
        self.scheduler_running = False
        self._event.set()
        self.thread.join()

    class schedule:
        def __init__(self, job: FunctionType, args: tuple = ()) -> None:
            self.job = job
            self.args = args

        def once(self, t: Union[str, int, float]):
            scheduler = Scheduler._instance
            if isinstance(t, str):
                t = datetime.timestamp(datetime.strptime(t, '%d/%m/%Y %H:%M'))
            now = datetime.timestamp(datetime.now())
            if t < now:
                logger.error('Cannot schedule task to the past')
                return
            i = 0
            scheduler._lock.acquire()
            while i < len(scheduler._scheduled_tasks) and t > scheduler._scheduled_tasks[i][2]:
                i += 1

            logger.debug(f'Inserting task at {i}')
            scheduler._scheduled_tasks.insert(i, (self.job, self.args, t))
            scheduler._lock.release()
            scheduler._event.set()

        # def every(self, t: Union[str, int, float])
