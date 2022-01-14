from donatello_framework import Donatello
from missions import Mission
import logging, time

class DDonatello(Donatello):
    def __init__(self) -> None:
        super().__init__()
        self.msn = Mission()

if __name__ == "__main__":

    try:
        # logging.basicConfig(level="DEBUG")
        donatello = DDonatello()
    except KeyboardInterrupt:
        donatello.stop()
