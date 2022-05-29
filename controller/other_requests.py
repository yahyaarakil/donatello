import logging

logger = logging.getLogger('OTHER_REQUESTS')

class Requests:
    def __init__(self, donatello) -> None:
        self.donatello = donatello

    def get_vitals(self, req, res):
        vitals = {
            'position': tuple(self.donatello.ardu.get_position()),
            'battery_percentage': self.donatello.ardu.get_battery_percentage(),
            'battery_voltage': self.donatello.ardu.get_battery_voltage(),
            'state': self.donatello.state.value
        }
        res.status(200).json(vitals)