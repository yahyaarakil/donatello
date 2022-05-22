from pymavlink import mavutil
from pymavlink import mavwp
import logging
from config import ARDU
from .parameters import param_dict
import fnmatch, math, time, struct
import numpy as np

logger = logging.getLogger('MAVLINK')

class Ardu:
    def __init__(self, donatello):
        self.donatello = donatello
        self.establish_connection()

    def establish_connection(self):
        self.connected = False
        self.connect()

        while not self.connected:
            self.donatello.flags['CRITICAL'] += 1
            self.donatello.flags['MAVLINK'] = False
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
        self.donatello.flags['CRITICAL'] -= 1
        self.donatello.flags['MAVLINK'] = True
        logger.info('Connected to ArduPilot')
        logger.info('Setting parameters')
        self.set_parameters()
        self.set_home(ARDU['HOME_COORDINATE'])
        self.home = ARDU['HOME_COORDINATE']
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


    def set_inclusion_fence(self, fence_file):
        if self._long_req((
            mavutil.mavlink.MAV_CMD_DO_FENCE_ENABLE, 
            0,
            1, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        )):
            logger.info('Fence enabled')
            self.fence_handler = mavwp.MAVFenceLoader()
            self.fence_handler.load(fence_file)
            for i in range(self.fence_handler.count()):
                self.connection.master.mav.send(self.fence_handler.point(i))
            logger.info('Fence Loaded')

        else:
            logger.info('Failed Fence')
            raise Exception()

    def set_rc_channel_pwm(self, channel_id, pwm=1500):
        """ Set RC channel pwm value switch to MANUAL mode !!!
        Args:
            channel_id (TYPE): Channel ID
            pwm (int, optional): Channel pwm value 1100-1900 1500 is idle
        """
        if channel_id < 1 or channel_id > 18:
            print("Channel does not exist.")
            return

        # Mavlink 2 supports up to 18 channels:
        # https://mavlink.io/en/messages/common.html#RC_CHANNELS_OVERRIDE
        # https://www.ardusub.com/developers/rc-input-and-output.html#rc-inputs
        # https://discuss.bluerobotics.com/t/pymavlink-send-rc-issue/11302

        rc_channel_values = [65535 for _ in range(8)]
        rc_channel_values[channel_id - 1] = pwm
        self.connection.master.mav.rc_channels_override_send(
            self.connection.master.target_system,
            self.connection.master.target_component,
            *rc_channel_values)

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
        gps = self.connection.recv_match(type='GPS_RAW_INT', blocking=True)
        gps = np.array((gps.lat, gps.lon, gps.alt))
        return gps / 10000000

    def get_battery_percentage(self):
        msg = self.connection.recv_match(type='SYS_STATUS', blocking=True)
        return msg.battery_remaining

    def get_battery_voltage(self):
        msg = self.connection.recv_match(type='SYS_STATUS', blocking=True)
        return msg.voltage_battery

    def _mavset(self, name, value, parm_type=None, retries=3):
        while retries > 0:
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
                    return True
        return False

    def set_parameters(self):
        for param_key, param_value in param_dict.items():
            logger.info(f"Setting parameter {param_key} to {param_value['val']}")
            if self._mavset(param_key, param_value['val'], param_value['type'], 1):
                logger.info('Parameter set')
            else:
                logger.error('Could not set parameter')
