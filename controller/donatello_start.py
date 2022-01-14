from donatello_framework import Donatello
from missions import Mission

class DDonatello(Donatello):
    def __init__(self) -> None:
        super().__init__()
        self.msn = Mission()

if __name__ == "__main__":
    donatello = DDonatello()
    donatello.sch.schedule.once()