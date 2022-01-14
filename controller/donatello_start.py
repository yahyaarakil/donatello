from donatello_framework import Donatello
from missions import Mission
from scheduling import Scheduler
import logging

# class DDonatello(Donatello):
#     def __init__(self) -> None:
#         super().__init__()
#         self.msn = Mission()

def printH():
    print('hello')
    sch.stop()

if __name__ == "__main__":
    logging.basicConfig(level="DEBUG")
    # donatello = DDonatello()
    sch = Scheduler()
    print('test')
    sch.schedule(printH).once('14/01/2022 22:00')
    sch.schedule(printH).once('14/01/2022 20:13')
    # sch.stop()