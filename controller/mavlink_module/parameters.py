# get numbers and values from
# https://ardupilot.org/rover/docs/parameters.html#parameters

from pymavlink import mavutil

param_dict = {
    # 'OA_TYPE': {'val': 2, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # OA_TYPE = 2
    # 'FENCE_ACTION': {'val': 0, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # FENCE_ACTION = 0
    # 'FENCE_ENABLE': {'val': 1, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # FENCE_ENABLE = 1
    # 'FENCE_RADIUS': {'val': 1000, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # FENCE_RADIUS = 1000
    # 'FENCE_MARGIN': {'val': 2, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # FENCE_MARGIN = 2 meters
    # 'AVOID_ENABLE': {'val': 3, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # AVOID_ENABLE = 3
    # 'FRAME_TYPE': {'val': 2, 'type': mavutil.mavlink.MAV_PARAM_TYPE_INT32}, # FRAME_TYPE = 2
}
