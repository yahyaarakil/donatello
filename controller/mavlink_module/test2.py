import os
from pymavlink.dialects.v20 import common as mavlink2
from pymavlink import mavutil, mavwp
import time

master =  mavutil.mavlink_connection(device="udpin:localhost:14551")
master.wait_heartbeat()

fenceloader = mavwp.MAVFenceLoader(master.target_system, master.target_component)

def enable_fence(bool):
    #enable fence
    en_d = 1 if bool else 0
    master.mav.command_long_send(
                master.target_system,
                master.target_component,
                mavutil.mavlink.MAV_CMD_DO_FENCE_ENABLE, 0,
                en_d, 0, 0, 0, 0, 0, 0)
    master.recv_match(type="COMMAND_ACK", blocking=True)

def fetch_fence_point(i):
    '''fetch one fence point'''
    master.mav.fence_fetch_point_send(master.target_system,
                                    master.target_component, i)
    tstart = time.time()
    p = None
    while time.time() - tstart < 3:
        p = master.recv_match(type='FENCE_POINT', blocking=False)
        if p is not None:
            break
        time.sleep(0.1)
        continue
    if p is None:
        print("Failed to fetch point %u" % i)
        return None
    return p


enable_fence(False)
fenceloader.load('./fence.txt')
master.mav.param_set_send(
    master.target_system,
    master.target_component,
    "FENCE_TOTAL".encode('utf8'),
    fenceloader.count(),
    3
)
master.mav.param_set_send(
    master.target_system,
    master.target_component,
    "FENCE_ACTION".encode('utf8'),
    0,
    3
)

master.recv_match(type='PARAM_VALUE', blocking=True)
# fenceloader.reindex()
for i in range(fenceloader.count()):
    p = fenceloader.point(i)
    master.mav.send(p)
    p2 = fetch_fence_point(i)
    if p2 is None:
        # param_set('FENCE_ACTION', action, 3)
        print('NO :(', p)
    print(p)

enable_fence(True)
master.arducopter_arm()

print("Waiting for the vehicle to arm")
master.motors_armed_wait()
print('Armed!')

