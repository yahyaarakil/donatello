from enum import Enum
import json

class MessageType(Enum):
    POST_TELEMETRY = 0
    POST_MESSAGE = 1
    POST_COMMAND = 2

class Message:
    def __init__(self, type: MessageType, field: str, payload: str, token: str = None):
        self.type = type
        self.field = field
        self.payload = payload
        self.token = token

    def __str__(self) -> str:
        return self.serialize()

    def __repr__(self) -> str:
        return self.serialize()

    def serialize(self):
        js = {
            'type': str(self.type),
            'field': self.field,
            'payload': self.payload,
        }
        if self.token:
            js['token'] = self.token
        return json.dumps(js)


    @staticmethod
    def deserialize(serialization: str):
        js = json.loads(serialization)
        return Message(js['type'], js['field'], js['payload'], js.get('token', None))
