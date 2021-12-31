from abc import ABC, abstractmethod

class State(ABC):
    @staticmethod
    @abstractmethod
    def start():
        pass

    @staticmethod
    @abstractmethod
    def update():
        pass