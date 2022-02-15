from pymavlink import mavutil
import logging
from .conf import *

logger = logging.getLogger('MAVLINK')

class Ardu:
    def __init__(self):
        self.connection = mavutil.mavlink_connection(ARDUPILOT_ADDRESS)
        if self.connection.wait_heartbeat(timeout=5):
            logging.info('Connected to ardupilot')
        else:
            logging.critical('Cannot establish communication with ArduPilot')
            raise Exception()

    def _long_req(self, args):
        try:
            self.connection.mav.command_long_send(
                self.connection.target_system,
                self.connection.target_component, 
                *args
            )
            return self.connection.recv_match(type='COMMAND_ACK', blocking=True)
        except Exception as e:
            logging.error('Ardupilot command failed')
            raise e

    def _arm(self, arm_disarm):
        if self._long_req((
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            arm_disarm,
            0,
            0,
            0,
            0,
            0,
            0,
        )).result != 0:
            raise Exception()

    def arm(self):
        try:
            self._arm(1)
            logging.info('ArduPilot Armed')
        except:
            logging.error('Failed to arm ArduPilot')

    def disarm(self):
        try:
            self._arm(0)
            logging.info('ArduPilot Disarmed')
        except:
            logging.error('Failed to disarm ArduPilot')
