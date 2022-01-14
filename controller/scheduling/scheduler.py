import threading, time

class ScheduledTask:
    def __init__(self) -> None:
        pass

class Scheduler:
    _instance = None
    def __init__(self) -> None:
        if Scheduler._instance:
            raise Exception('Scheduler is a singleton!')
        self.scheduling_thread = threading.Thread(target=self._scheduling_main)
        Scheduler._instance = self
        self.scheduled_once = []

    def _scheduling_main(self):
        pass

    # organizer class
    class schedule:
        @staticmethod
        def once():
            pass