
import akShareSer.akShare as akTask
import akshare as ak
import numpy as np
import time


# data = ak.fund_em_value_estimation()
# # data.columns = ['id', 'fundCode', 'abbreviation', 'todayVal', 'todayValRate',
# #                 'todayValOver', 'todayValRateOver', 'deviation', 'unitValue']
# info = data[data['fundCode'].isin(["005453", '260112'])]
# print(info.to_dict())


# print(data[info[0][0]].to_dict())
# # 用sqlalchemy构建数据库链接engine
# db_info = {'user': 'hmsnc',
#            'password': 'hm',
#            'host': '192.168.188.188',
#            'database': 'test'  # 这里我们事先指定了数据库，后续操作只需要表即可
#            }
# engine = create_engine('mysql+pymysql://%(user)s:%(password)s@%(host)s/%(database)s?charset=utf8' %
#                        db_info, encoding='utf-8')  # 这里直接使用pymysql连接,echo=True，会显示在加载数据库所执行的SQL语句。

fund_em_open_fund_info = ak.fund_em_open_fund_info(
    fund='008087', indicator='单位净值走势')
print('begin')
print(fund_em_open_fund_info)

# fund_em_value_estimation = ak.fund_em_value_estimation(symbol='全部')
# print(fund_em_value_estimation)

# x = fund_em_value_estimation[fund_em_value_estimation['基金代码']
#                              == '005827']['2021-12-23-估算数据-估算增长率'].to_dict()
# for val in x.values():
#     print(val)
# fund_em_fund_name.columns = ["fundCode", "abbreviation", "unitValue", "cumulNetValue", "beforeUnitValue",
#                              "beforeCumulNetValue", "growth", "growthRate", "subscriptionStatus", "redemptionStatus", "poundage"]
# fund_em_fund_name.to_sql('t_dat_realTime_fund', engine,
#                          index=True, if_exists='replace')
# print(fund_em_fund_name.where(
#     fund_em_fund_name["2021-12-22-单位净值"] == '2.1539'))
# fund_em_fund_name.where()
# a = fund_em_fund_name[fund_em_fund_name['fundCode']
#                       == '007689']
# print(a.to_dict())
