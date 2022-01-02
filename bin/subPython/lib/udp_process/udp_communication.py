
from socket import socket, AF_INET, SOCK_DGRAM
from threading import Thread


# 通讯层
class communication:
    def __init__(self):
        pass

    def init(self, messge_handler, receiver_worker, port=0, ip='127.0.0.1'):
        self.close = False
        # 传输最大
        self.BUFSIZE = 61440
        # 绑定本机随机可用端口
        self.ip_port = (ip, port)
        #
        self.socket = socket(AF_INET, SOCK_DGRAM)
        self.socket.bind(self.ip_port)
        # 线程监听
        self.receiver_thread = Thread(
            target=self.__message_receiver, args=(messge_handler, receiver_worker))
        self.receiver_thread.start()

    def __message_receiver(self, messge_handler, receiver_worker):
        while not self.close:
            try:
                data, client_addr = self.socket.recvfrom(self.BUFSIZE)
                messge_handler(data, receiver_worker, client_addr)
            except Exception as e:
                print("communication.__message_receiver:", e)
        self.socket.close()

    def send_msg(self, data, client_addr):
        self.socket.sendto(data, client_addr)
