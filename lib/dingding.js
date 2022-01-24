
let tools = require('./tools')
let webHock = "https://oapi.dingtalk.com/robot/send?access_token=339b73ac2ae39cc3cb7016b53a1cbd4dcc783f97a6248649bfef3dfeb38c88f6"
let secret = "SECd51cd4adc47f90c3842f9bdbd2f1854ae1b00234710a092c302762886503032e"
let url = tools.getDingDingRobtReqUrl(webHock, secret)

function sendDingdingMsg(content = '默认测试', atMobiles = [], atUserIds = [], isAtAll = false) {
    tools.requestHttp(url, {
        "at": {
            "atMobiles": atMobiles,
            "atUserIds": atUserIds,
            "isAtAll": isAtAll
        },
        "text": {
            "content": `${content}`
        },
        "msgtype": "text"
    }, "post")
}

module.exports = {
    sendDingdingMsg
}
