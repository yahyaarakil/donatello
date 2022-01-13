from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, Operation
import time, logging
from event_system import Engine

def interface(message):
    logging.info(message.serialize())

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)
        logging.info('Starting Finite State Machine Module')
        fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)
        logging.info('Starting Communication Module')
        comm = Communication(recv_callback=interface) # ASYNC! (SEPARATE THREAD)
        comm.sendMessage(Message(Operation.POST_COMMAND, 'SCHEDULE_START', '1641654194, CLEAN, MISSION_1', None))
        comm.sendMessage(Message(Operation.POST_TELEMETRY, 'GPS', '41.40338, 2.17403', 'my_token'))
        pass
    except KeyboardInterrupt:
        logging.info('Stopping modules and exiting')
        comm.stop()
        fsm.stop()
        comm.listen_thread.join()
        fsm.fsm_thread.join()
        time.sleep(1)

if __name__ == '__main__':
    main()