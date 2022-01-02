from threading import Thread
from lib.udp_process.udp_communication import communication
import json

# 先这样吧  不用太完善
# 协议层
# //不大于64KB  先这样吧！！
# //协议 (udp通讯)
# //报文  标志位1+msgId+msg+（msgMd5）
# //标志位1  0 请求  1 应答  1字节
# //msgId   递增数    5字节
# //msg 数据体  未知字节
# //msgMd5   16字节 (暂时不需要吧 反正又不分包)
# //


class prcess_protocol:
    def __init__(self):
        self.msg_id = 0
        self.communication = communication()

    def init(self, receiver_worker):
        self.communication.init(self.__messge_handler, receiver_worker)

    def __messge_handler(self, data, receiver_worker, client_addr):
        try:
            # self.communication.send_msg()
            # //报文  标志位1+msgId+msg+（msgMd5）
            data_decode = data.decode('utf-8')
            # //标志位1  0 请求  1 应答  1字节
            flag1 = int(data_decode[0:1])
            # //msgId   递增数    5字节
            msg_id = int(data_decode[1:6])
            # //msg 数据体  未知字节
            msg = data_decode[6:]

            if hasattr(receiver_worker, "handler"):
                receiver_thread = Thread(target=receiver_worker.handler, args=(
                    flag1, msg_id, None if msg == "{}" else json.load(msg), client_addr))
                receiver_thread.start()
            else:
                print("prcess_protocol.__messge_handler:receiver_handler no handler")
                pass
        except Exception as e:
            print("prcess_protocol.__messge_handler:", e)
            print('文件', e.__traceback__.tb_frame.f_globals['__file__'])
            print('行号', e.__traceback__.tb_lineno)

    def send_req(self, data, client_addr):
        res = (None, None)
        self.msg_id = self.msg_id+1
        self.msg_id = self.msg_id if self.msg_id < 70000 else 0
        msg = '{}{}{}'.format(0, "%05d" % self.msg_id,
                              json.dumps(data)).encode('utf-8')
        self.communication.send_msg(msg, client_addr)
        return res

    def send_res(self, msg_id, data, client_addr, ):
        msg = '{}{}{}'.format(1, "%05d" %
                              msg_id, json.dumps(data)).encode('utf-8')
        self.communication.send_msg(msg, client_addr)
        pass
