from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, MessageType
import time, logging
from communications import Communication

def interface(message):
    logging.info(message.serialize())

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)
        fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)
        comm = Communication(recv_callback=interface) # ASYNC! (SEPARATE THREADING)
        comm.sendMessage(Message(MessageType.POST_COMMAND, 'SCHEDULE_START', '1641654194, CLEAN, MISSION_1', None))
        comm.sendMessage(Message(MessageType.POST_TELEMETRY, 'GPS', '41.40338, 2.17403', 'my_token'))
        pass
    except KeyboardInterrupt:
        comm.stop()
        fsm.stop()
        time.sleep(1)

if __name__ == '__main__':
    main()