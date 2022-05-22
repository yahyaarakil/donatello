import os
from pymavlink.dialects.v20 import common as mavlink2
from pymavlink import mavutil
import time
os.environ['MAVLINK20'] = '1'


def polinom(filename):
    with open(filename) as f:
        try:
            return [tuple(map(float, i.split('\t'))) for i in f]
        except:
            return [tuple(map(float, i.split(' '))) for i in f]

poli = polinom("fence.txt")


master =  mavutil.mavlink_connection(device="tcp:127.0.0.1:5762")
master.wait_heartbeat()


for i in range(len(poli)):

    a = mavutil.mavlink.MAVLink_fence_point_message(master.target_system, 
                                            master.target_component,
                                            i, 
                                            len(poli), 
                                            poli[i][0],
                                            poli[i][1],)
    master.mav.send(a)
    time.sleep(0.1)
    print(a)


    # master.mav.command_long_send(
    #             master.target_system,
    #             master.target_component,
    #             mavlink2.MAV_CMD_NAV_FENCE_POLYGON_VERTEX_INCLUSION, 0,
    #             len(poli), 
    #             0, 
    #             0, 
    #             0, 
    #             poli[i][0],
    #             poli[i][1], 
    #             0)
time.sleep(1)

#enable fence
master.mav.command_long_send(
            master.target_system,
            master.target_component,
            mavutil.mavlink.MAV_CMD_DO_FENCE_ENABLE, 0,
            1, 0, 0, 0, 0, 0, 0)


master.arducopter_arm()

print("Waiting for the vehicle to arm")
master.motors_armed_wait()
print('Armed!')

