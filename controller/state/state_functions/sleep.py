import threading

def start(meta_state):
    meta_state.e = threading.Event()
    meta_state.e.wait()

def update(meta_state):
    start(meta_state)
