import copy

class Mission:
    def __init__(self, pattern, name, time) -> None:
        self.path = copy.copy(pattern)
        self.name = name
        self.time = time

    def serialize(self):
        return {
            'path': self.path,
            'name': self.name,
            'time': self.time,
        }