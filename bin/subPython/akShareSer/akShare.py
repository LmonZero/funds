import akshare as ak
import pandas as pd
import numpy as np


class akShareTask:
    def __init__(self) -> None:
        # db_info = {'user': 'hmsnc',
        #            'password': 'hm',
        #            'host': '192.168.188.188',
        #            'database': 'test'  # 这里我们事先指定了数据库，后续操作只需要表即可
        #            }
        # self.db_info = db_info
        # self.engine = create_engine('mysql+pymysql://%(user)s:%(password)s@%(host)s/%(database)s?charset=utf8' %
        #                             db_info, encoding='utf-8')  # 这里直接使用pymysql连接,echo=True，会显示在加载数据库所执行的SQL语句。
        self.cmd = {
            '1001': {'func': ak.fund_em_fund_name,
                     'columns': ["fundCode", "initials", "abbreviation", "type", "fullName"]},
            '1002': {'func': ak.fund_em_open_fund_daily,
                     'columns': ["fundCode", "abbreviation", "unitValue", "cumulNetValue", "beforeUnitValue", "beforeCumulNetValue", "growth", "growthRate", "subscriptionStatus", "redemptionStatus", "poundage"]},
            '1003': {'func': ak.fund_em_open_fund_info,
                     'columns': ["date", "value", "valueRate"]},
            '1004': {'func': "",
                     'columns': []},
            '1005': {'func': "",
                     'columns': []},
            '1006': {'func': "",
                     'columns': []},
            '1007': {'func': "",
                     'columns': []},
            '1008': {'func': "",
                     'columns': []},
            '1009': {'func': "",
                     'columns': []},
            '1010': {'func': "",
                     'columns': []},
            '1011': {'func': "",
                     'columns': []},
            '1012': {'func': ak.fund_em_value_estimation,
                     'columns': ['id', 'fundCode', 'abbreviation', 'todayVal', 'todayValRate', 'todayValOver', 'todayValRateOver', 'deviation', 'unitValue']}
        }

    def switchCmd(self, cmd,  **kwargs):
        res = None
        strCmd = str(cmd)
        if(strCmd in self.cmd):
            if(kwargs):
                res = self.cmd[strCmd]['func'](**kwargs)
            else:
                res = self.cmd[strCmd]['func']()
            if self.cmd[strCmd]["columns"]:
                res.columns = self.cmd[strCmd]["columns"]
            pass
        else:
            print(cmd, ' is lack')
            pass

        return res

    def everyday_callme_fund(self, fundCodes=[]):
        # 1002、 1012  //放弃了  什么垃圾python
        data1002 = self.switchCmd('1002')
        data1003 = self.switchCmd('1003', symbol='全部')

        for code in fundCodes:
            info = np.where(data1002 == code)
            # if(len(info[0])):

            #     # for task in tasks:
            #     #     print(task)
