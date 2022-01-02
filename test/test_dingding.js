let tools = require('../lib/tools')
let webHock = "https://oapi.dingtalk.com/robot/send?access_token=c88645fdecbb3966de0973147ee617c68e19a646acd1ba4bde386111b4cdd10b"
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