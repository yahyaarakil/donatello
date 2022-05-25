from enum import Enum
import json

class Method(str, Enum):
    GET = 'GET'
    POST = 'POST'
    PATCH = 'PATCH'
    DELETE = 'DELETE'
    PUT = 'PUT'

class Message:
    def __init__(self, body: dict = None, id: int = 0):
        if self.__class__ == Message:
            raise Exception('Cannot instantiate Message')
        self.body = body
        self.id = id

    def __str__(self) -> str:
        return self.serialize()

    def __repr__(self) -> str:
        return self.serialize()

    def serialize(self):
        return json.dumps(self.__dict__)

class Request(Message):
    def __init__(self, method: Method = None, path: str = None, body: dict = {}, id: int = 0):
        super().__init__(body=body, id=id)
        self.method = method
        self.path = path

    def serialize(self):
        return json.dumps({ 'id': self.id, 'request': { 'method': self.method, 'path': self.path, 'body': self.body } })

class Response(Message):
    def __init__(self, code: int = None, body: dict = {}, id: int = 0):
        super().__init__(body=body, id=id)
        self.code = code

    def serialize(self):
        return json.dumps({ 'id': self.id, 'response': { 'code': self.code, 'body': self.body } })

    def status(self, status: int):
        self.code = status
        return self

    def json(self, obj: object):
        self.body = json.dumps(obj)
        return self

    def text(self, obj: object):
        self.body = obj
        return self

def deserialize(serialization: str):
    mesg = json.loads(serialization)
    if len(mesg) < 1:
        raise Exception('Invalid message json')
    if 'request' in mesg:
        r = Request()
        r.__dict__ = mesg['request']
    elif 'response' in mesg:
        r = Response()
        r.__dict__ = mesg['response']
    else:
        raise Exception('Invalid message json')
    r.id = mesg['id']
    return r