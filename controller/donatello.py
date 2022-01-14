from finite_state_machine import FiniteStateMachine
from communications import Communication, Message, Method, Router, Request, Response, deserialize
import time, logging

def main():
    try:
        logging.basicConfig(level=logging.DEBUG)

        # logging.info('Starting Finite State Machine Module')
        # fsm = FiniteStateMachine() # ASYNC! (SEPARATE THREAD)

        logging.info('Starting Communication Module')
        comm = Communication() # ASYNC! (SEPARATE THREAD)
        
        r = Router()
        r.post('state', lambda message: print(message.body))
        s = Router()
        s.post('hello', r)
        comm.post('FSM.set', s)
        comm.makeRequest(Request(Method.POST, 'FSM.set.hello.state', {'state': 'Idle'}), lambda message: print(message.body))
        comm.makeRequest(Request(Method.POST, 'FSM.set.hello.state', {'state': 'Idle'}))
    except KeyboardInterrupt:
        logging.info('Stopping modules and exiting')
        comm.stop()
        # fsm.stop()
        # comm.listen_thread.join()
        # fsm.fsm_thread.join()

if __name__ == '__main__':
    main()