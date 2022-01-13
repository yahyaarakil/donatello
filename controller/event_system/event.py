from typing import Callable, Union
import logging
from communications import Operation

class Condition:
    def __init__(self, name: str, callback: Callable, args: tuple = ()) -> None:
        self.name = name
        self.callback = callback
        self.args = args

class Effect:
    def __init__(self, name: str, callback: Callable, args: tuple = ()) -> None:
        self.name = name
        self.callback = callback
        self.args = args

class Trigger:
    def __init__(self, field: str, operation: Operation) -> None:
        self.field = field
        self.operation = operation

class Event:
    def __init__(self, att: dict) -> None:
        try:
            logging.debug('Event dictionary constructor called')
            self.name = att['name']
            self.conditions = att['conditions']
            self.effects = att['effects']
        except:
            raise Exception('Invalid Event initialization')

    def evaluate_event(self, payload: dict):
        for condition in self.conditions:
            if not condition.callback(*condition.args):
                return
        for effect in self.effects:
            effect.callback(*([payload] + list(effect.args)))