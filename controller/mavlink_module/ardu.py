from pymavlink import mavutil
import logging
from config import ARDU
from .parameters import param_dict
import fnmatch, math, time, struct

logger = logging.getLogger('MAVLINK')

class Ardu:
    def __init__(self):
        self.connected = False
        self.connect()

        while not self.connected:
            self.connection.close()
            logger.critical('Cannot establish communication with ArduPilot')
            logger.info('Retrying in 5 seconds')
            time.sleep(5)
            self.connect()

    def connect(self):
        self.connection = mavutil.mavlink_connection(ARDU['ARDUPILOT_ADDRESS'])
        if self.connection.wait_heartbeat(timeout=5):
            self.connected_p()

    def connected_p(self):
        self.connected = True
        logger.info('Connected to ArduPilot')
        logger.info('Setting parameters')
        self.set_parameters()
        self.set_home(ARDU['HOME_COORDINATE'])
        self.disarm()
        self.change_mode('GUIDED')

    def _long_req(self, args, res_type='COMMAND_ACK'):
        try:
            self.connection.mav.command_long_send(
                self.connection.target_system,
                self.connection.target_component, 
                *args
            )
            return self.connection.recv_match(type=res_type, blocking=True)
        except Exception as e:
            logger.error('Ardupilot command failed')
            raise e

    def go_to_global(self, gps_coordinate):
        self.connection.mav.send(
            mavutil.mavlink.MAVLink_set_position_target_global_int_message(
                10,
                self.connection.target_system,
                self.connection.target_component,
                mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                int(0b110111111000),
                int(gps_coordinate[0] * 10**7), # latitude
                int(gps_coordinate[1] * 10**7), # longitude
                1, # altitude,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            )
        )
        logger.info(f'Going to {gps_coordinate}')

    # def set_includion_fence(self, fence_points):
    #     if self._long_req((
    #         mavutil.mavlink.MAV_CMD_DO_FENCE_ENABLE,
    #         0,
    #         1,
    #         0,
    #         0,
    #         0,
    #         0,
    #         0,
    #         0,
    #     )):
    #         logger.info('Fence enabled')
    #         for point in fence_points:
    #             pass
    #     else:
    #         raise Exception()

    def change_mode(self,mode):
        # Check if mode is available
        if mode not in self.connection.mode_mapping():
            logger.error(f'Unknown mode : {mode}')
            return

        # Get mode ID
        mode_id = self.connection.mode_mapping()[mode]

        self.connection.mav.set_mode_send(
            self.connection.target_system,
            mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
            mode_id,
        )
        # Wait for ACK command
        if self.connection.recv_match(type="COMMAND_ACK", blocking=True).result != 0:
            logger.error(f'Failed to set mode to {mode}')
        else:
            logger.info(f'Mode set to {mode}')

    def return_to_launch(self):
        if self._long_req((
            mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
        )).result != 0:
            logger.error('Can NOT RTL')
        else:
            logger.info('RTL')

    def set_home(self, gps_coordinate):
        if self._long_req((
            mavutil.mavlink.MAV_CMD_DO_SET_HOME,
            0,
            0,
            0,
            0,
            0,
            gps_coordinate[0], # latitude
            gps_coordinate[1], # longitude
            gps_coordinate[2], # altitiude
        )).result != 0:
            logger.error('Can NOT set ArduPilot home')
        else:
            logger.info('ArduPilot home set')

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
            logger.info('Armed')
        except Exception as e:
            logger.error('Failed to arm')
            raise e

    def disarm(self):
        try:
            self._arm(0)
            logger.info('Disarmed')
        except:
            logger.error('Failed to disarm')

    # lat long lat
    def get_position(self):
        gps = self.connection.messages['GPS_RAW_INT']
        return (gps.lat, gps.lon, gps.alt)

    def get_battery_percentage(self):
        return self.connection.messages['SYS_STATUS'].battery_remaining

    def get_battery_voltage(self):
        return self.connection.messages['SYS_STATUS'].voltage_battery

    def _mavset(self, name, value, parm_type=None, retries=3):
        got_ack = False

        while retries > 0 and not got_ack:
            retries -= 1
            self.connection.mav.param_set_send(
                self.connection.target_system,
                self.connection.target_component,
                name.encode('utf8'),
                value,
                parm_type
            )
            tstart = time.time()
            while time.time() - tstart < 1:
                ack = self.connection.recv_match(type='PARAM_VALUE', blocking=True)
                if str(name).upper() == str(ack.param_id).upper():
                    got_ack = True
                    break
        if not got_ack:
            return False
        return True

    def set_parameters(self):
        for param_key, param_value in param_dict.items():
            logger.info(f"Setting parameter {param_key} to {param_value['val']}")
            if self._mavset(param_key, param_value['val'], param_value['type'], 1):
                logger.info('Parameter set')
            else:
                logger.error('Could not set parameter')
