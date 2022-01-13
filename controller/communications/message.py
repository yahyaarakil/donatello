from enum import Enum
import json

class Method(str, Enum):
    GET = 'GET'
    POST = 'POST'
    PATCH = 'PATCH'
    DELETE = 'DELETE'
    PUT = 'PUT'

class Code(str, Enum):
    C200 = 'OK'
    C400 = 'BAD REQUEST'
    C404 = 'NOT FOUND'
    C500 = 'INTERNAL SERVER ERROR'

class Message:
    def __init__(self, body: dict = None):
        if self.__class__ == Message:
            raise Exception('Cannot instantiate Message')
        self.body = body

    def __str__(self) -> str:
        return self.serialize()

    def __repr__(self) -> str:
        return self.serialize()

    def serialize(self):
        return json.dumps(self.__dict__)

class Request(Message):
    def __init__(self, method: Method = None, path: str = None, body: dict = None):
        super().__init__(body=body)
        self.method = method
        self.path = path

    def serialize(self):
        return 'request:'+super().serialize()

class Response(Message):
    def __init__(self, code: Code = None, body: dict = None):
        super().__init__(body=body)
        self.code = code

    def serialize(self):
        return 'response:'+super().serialize()

def deserialize(serialization: str):
    spec = serialization.split(':')[0].lower()
    if spec == 'request':
        mesg = Request()
        serialization = serialization[len('request:'):]
    elif spec == 'response':
        serialization = serialization[len('response:'):]
        mesg = Response()
    mesg.__dict__ = json.loads(serialization)
    return mesg