from enum import Enum
import json

class Operation(str, Enum):
    GET = 'GET'
    POST = 'POST'
    PATCH = 'PATCH'
    DELETE = 'DELETE'
    PUT = 'PUT'

class Message:
    def __init__(
            self, operation: Operation = None,
            field: str = None,
            payload: dict = None
        ):
        self.operation = operation
        self.field = field
        self.payload = payload

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
