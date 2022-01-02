from lib.udp_process.udp_process_protocol import prcess_protocol
import os

global myMainPid
myMainPid = os.getppid()


class worker:
    def __init__(self):
        pass

    def init(self):
        self.process_controller = prcess_protocol()
        self.process_controller.init(self)
        self.process_register(myMainPid, ("127.0.0.1", 6666))

    def handler(self, flag_req_res, msg_id, msg, client_addr):
        if flag_req_res == 0:
            self.req_handler(msg_id, msg, client_addr)
            pass
        else:
            self.req_handler()
            pass
    # 注册

    def process_register(self, pid, client_addr):
        self.process_controller.send_req(
            {'cmd': 0, 'value': {'pid': pid}}, client_addr)

    def req_handler(msg_id, msg, client_addr):
        # 接收请求

        pass

    def res_handler(msg, client_addr):
        # 接收应答

        pass
