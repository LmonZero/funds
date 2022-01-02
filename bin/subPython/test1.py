# import socket
# BUFSIZE = 1024
# ip_port = ('127.0.0.1', 9999)
# server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # udp协议
# server.bind(ip_port)

# while True:
#     data, client_addr = server.recvfrom(BUFSIZE)
#     print('server收到的数据', data)

#     server.sendto(data.upper(), client_addr)

# server.close()

# if 1:

#     data = b'00010002{"NORES":">>??"}'
#     print(int(data.decode("utf-8")[0:4]))
#     print(data.decode("utf-8")[4:8])
#     # pass
#     print(data.decode("utf-8")[8:])
#     print(data[8:])
#     pass

from os import read
import threading
import time
from lib.udp_process import udp_communication
import json
import os


def thread1(name):
    # for i in range(2):
    #     time.sleep(2)
    #     print(name, i)
    while True:
        # time.sleep(1)
        pass


def thread2(name):
    for i in range(2):
        time.sleep(1)
        print(name, i)


def test(a):
    print(type(a))
    print(type(a) == dict)


def test1():
    try:
        a = 123
        b = 456
        import aaa
    except Exception as e:
        print(e)
        print('文件', e.__traceback__.tb_frame.f_globals['__file__'])
        print('行号', e.__traceback__.tb_lineno)


print("active", threading.active_count())  # 1


def main():
    s = open("./a.json", 'r')
    try:
        pid = os.getpid()

        print('----------------')
        # 进程ID
        print('Process id : %d' % pid)

        # a = s.read()
        # print(a)
        # load_dict = json.load(a)
        # print(load_dict)
        test1()
        test({'s': 10})
        a = 1
        b = 10001

        print('{}.{}'.format("%05d" % (+a), "%05d" % b))

        print('{}.{}.a'.format(1, 1).encode("utf-8"))

        print("active", threading.active_count())  # 1
        udp = udp_communication.communication()

        def recriver(data, client_addr):
            print('got msg:', data)
            udp.send_msg(data, client_addr)
            print('send msg:', data)
        udp.init(recriver, 9999)
        print("active", threading.active_count())
        t1 = threading.Thread(target=thread1, args=("thread1",))
        t1.start()
        print("active", threading.active_count())
        t2 = threading.Thread(target=thread2, args=("thread2",))
        t2.start()
        print("active", threading.active_count())

        # for i in range(5):
        #     time.sleep(0.5)
        #     print('main', i)

        # print('')
        # t1.join()
        # t2.join()
        udp.receiver_thread.join(timeout=10)
        print('??', udp.receiver_thread.is_alive())
        print('111??', t1.is_alive())

        # time.sleep(20)
        print("activeokoko", threading.active_count())
    except Exception as e:
        print("main:", e)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("__main__:", e)
    finally:
        print("end")
        print("active", threading.active_count())
