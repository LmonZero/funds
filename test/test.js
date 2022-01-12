let tools = require('../lib/tools')
let webHock = "https://oapi.dingtalk.com/robot/sendBySession?session=bc473a866062e454f10cbeaf25aeb564"
let secret = "SECd51cd4adc47f90c3842f9bdbd2f1854ae1b00234710a092c302762886503032e"
let url = tools.getDingDingRobtReqUrl(webHock, secret)

tools.requestHttp(url, {
    "at": {
        "atMobiles": [
            ""
        ],
        "atUserIds": [
            ""
        ],
        "isAtAll": false
    },
    "text": {
        "content": "aaa"
    },
    "msgtype": "text"
}, "post").then(v => { console.log(v) })