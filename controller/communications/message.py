from enum import Enum
import json

class Method(str, Enum):
    GET = 'GET'
    POST = 'POST'
    PATCH = 'PATCH'
    DELETE = 'DELETE'
    PUT = 'PUT'

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
        return json.dumps({ 'request': self.__dict__ })

class Response(Message):
    def __init__(self, code: int = None, body: dict = None):
        super().__init__(body=body)
        self.code = code

    def serialize(self):
        return json.dumps({ 'response': self.__dict__ })

    def status(self, status: int):
        self.code = status
        return self

    def json(self, obj: object):
        self.body = json.dumps(obj)

    def text(self, obj: object):
        self.body = obj

def deserialize(serialization: str):
    mesg = json.loads(serialization)
    if len(mesg) < 1:
        raise Exception('Invalid message json')
    if list(mesg.keys())[0].lower() == 'request':
        r = Request()
    elif list(mesg.keys())[0].lower() == 'response':
        r = Response()
    else:
        raise Exception('Invalid message json')
    r.__dict__ = mesg[list(mesg.keys())[0]]
    return r