from threading import Thread, Lock
from queue import Queue


class signal:
    def __init__(self) -> None:
        self.signalDict = {

        }
        self.mutex = Lock()
        # {name:}
        pass

    def on(self, name, func):
        self.mutex.acquire()

        self.mutex.release()
        pass

    def emit(self, name, res):
        pass
