from communications import Message, Operation
from .event import Event, Trigger, Condition, Effect

class Engine:
    def __init__(self) -> None:
        self.triggers = {}

    def add_event(self, event: Event, trigger: Trigger):
        if type(event) != Event:
            raise Exception('Adding invalid event')
        if type(trigger) != Trigger:
            raise Exception('Adding invalid trigger')

        trigger_field = self.triggers.get(trigger.field, None)
        if trigger_field == None:
            self.triggers[trigger.field] = {}
            trigger_field = self.triggers[trigger.field]
            
        trigger_operation = trigger_field.get(trigger.operation, None)
        if trigger_operation == None:
            trigger_field[trigger.operation] = []
            trigger_operation = trigger_field[trigger.operation]

        trigger_operation.append(event)

    def invoke_trigger(self, message: Message):
        trigger_field = self.triggers.get(message.field, None)
        if trigger_field == None:
            return
        trigger_operation = trigger_field.get(message.operation, None)
        if trigger_operation == None:
            return
        for event in trigger_operation:
            event.evaluate_event(message.payload)