from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, Operation
import time, logging
from event_system import FilledEngine

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)

        logging.info('Starting Finite State Machine Module')
        fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)

        evnt = FilledEngine(fsm)

        def interface(message):
            logging.debug('Invoking trigger')
            evnt.invoke_trigger(message)

        logging.info('Starting Communication Module')
        comm = Communication(recv_callback=interface) # ASYNC! (SEPARATE THREAD)
        comm.sendMessage(Message(Operation.POST, 'FSM.state', 'Idle'))
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