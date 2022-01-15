from typing import Union
from types import FunctionType, MethodType

from .message import Request, Response, Method

class Router:
    pass
class Router:
    def __init__(self) -> None:
        self.methods_routing = {}
        for method in Method:
            self.methods_routing[method] = {}
            self.__dict__[method.split('.')[-1].lower()] = self._create_adder(method)
            self.__dict__['do_'+method.split('.')[-1].lower()] = self._create_doer(method)

    def use(self, path: str, action: Union[FunctionType, MethodType, Router]):
        for method in Method:
            self._create_adder(method)(path, action)

    def _create_adder(self, method):
        def adder(path: str, action: Union[FunctionType, MethodType, Router]):
            if isinstance(action, (FunctionType, MethodType, Router)):
                self.methods_routing[method][path] = action
            else:
                raise Exception('Invalid action')
        return adder

    def _create_doer(self, method):
        def doer(path: str):
            action = self.methods_routing[method].get(path, None)
            if isinstance(action, (FunctionType, MethodType)):
                return action
            
            action = self.methods_routing[method].get(path.split('.')[0], None)

            return action.__dict__['do_'+method.split('.')[-1].lower()]('.'.join(path.split('.')[1:]))
        return doer

    def invoke(self, request: Request, response: Response):
        path, method = request.path, request.method
        action = self.__dict__['do_'+method.split('.')[-1].lower()](path)
        if isinstance(action, (FunctionType, MethodType)):
            action(request, response)