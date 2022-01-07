from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, MessageType
import time, logging
from communications import Communication

def interface(message):
    logging.info(message.serialize())

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)
        # fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)
        # time.sleep(5)
        # fsm.meta_state.e.set()
        comm = Communication(recv_callback=interface) # ASYNC! (SEPARATE THREADING)
        time.sleep(1)
        print("DONE")
        comm.sendMessage(Message(MessageType.POST_COMMAND, 'none', 'none', 'none'))
        time.sleep(1)
        comm.sendMessage(Message(MessageType.POST_COMMAND, 'none', 'none', 'none'))
        pass
    except KeyboardInterrupt:
        comm.stop()
        time.sleep(1)

if __name__ == '__main__':
    main()