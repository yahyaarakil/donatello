from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, MessageType
import time, logging
import asyncio
from communications import Communication

def print_m(message):
    logging.info(message)

def main():
    logging.basicConfig(level=logging.INFO)
    # fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)
    # time.sleep(5)
    # fsm.meta_state.e.set()
    comm = Communication(process_callback=print_m) # ASYNC! (DYNAMIC THREADING)
    time.sleep(2)
    # comm.sendMessage(Message(MessageType.POST_COMMAND, 'none', 'none', 'none'))
    print("DONE")
    pass

if __name__ == '__main__':
    main()
