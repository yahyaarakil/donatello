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
        self._event = threading.Event()
        self.thread = threading.Thread(target=self._main_waiter)
        self._scheduled_tasks = []
        self._lock = threading.Lock()
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
                wait_time = next_task_time - now
                if wait_time > 0:
                    self._lock.release()
                    logger.debug(f'Waiting for {wait_time:.2f}')
                    self._event.clear()
                    self._event.wait(wait_time)
                else:
                    job, args, t, recur = self._scheduled_tasks.pop(0)
                    self._lock.release()
                    if recur > 0:
                        now = datetime.timestamp(datetime.now())
                        Scheduler._instance.schedule(job, args).every(recur)
                    threading.Thread(target=job, args=args).start()
            else:
                self._lock.release()
                logger.debug(f'Waiting forever')
                self._event.clear()
                self._event.wait()
        logger.info('Scheduler exiting')

    def stop(self):
        self.scheduler_running = False
        time.sleep(0.1)
        self._event.set()
        self.thread.join()

    class schedule:
        def __init__(self, job: FunctionType, args: tuple = ()) -> None:
            self.job = job
            self.args = args

        def _insert_task(self, t, recur=0):
            scheduler = Scheduler._instance
            i = 0
            scheduler._lock.acquire()
            while i < len(scheduler._scheduled_tasks) and t > scheduler._scheduled_tasks[i][2]:
                i += 1

            logger.debug(f'Inserting task at {i}')
            scheduler._scheduled_tasks.insert(i, (self.job, self.args, t, recur))
            scheduler._lock.release()
            scheduler._event.set()
            # return scheduler._scheduled_tasks[i]

        def once(self, t: Union[str, int, float]):
            if isinstance(t, str):
                t = datetime.timestamp(datetime.strptime(t, '%d/%m/%Y %H:%M'))
            now = datetime.timestamp(datetime.now())
            if t < now:
                logger.error('Cannot schedule task to the past')
                return None
            self._insert_task(t)

        def after(self, t: int):
            now = datetime.timestamp(datetime.now())
            t += now
            self._insert_task(t)

        def every(self, t: int):
            now = datetime.timestamp(datetime.now())
            self._insert_task(t+now, t)
