from enum import Enum
import json

class Operation(str, Enum):
    POST_TELEMETRY = 'POST_TELEMETRY'
    POST_MESSAGE = 'POST_MESSAGE'
    POST_COMMAND = 'POST_COMMAND'

class Message:
    def __init__(self):
        pass
    def __init__(
            self, operation: Operation = None,
            field: str = None,
            payload: dict = None, token: str = None
        ):
        self.operation = operation
        self.field = field
        self.payload = payload
        self.token = token

    def __str__(self) -> str:
        return self.serialize()

    def __repr__(self) -> str:
        return self.serialize()

    def serialize(self):
        return json.dumps(self.__dict__)

    @staticmethod
    def deserialize(serialization: str):
        mesg = Message()
        mesg.__dict__ = json.loads(serialization)
        return mesg
