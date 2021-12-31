from finite_state_machine import FiniteStateMachine
import time

def main():
    fsm = FiniteStateMachine() # ASYNC!
    time.sleep(5)
    fsm.meta_state.e.set()

if __name__ == '__main__':
    main()