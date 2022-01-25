const dayjs = require("dayjs")



async function main(info) {

    if (info) {
        if (info.param.length >= 1) {
            let datas = await instance.mysqlHelperIntance.searchReviewNote(...info.param)
            let res = datas.length ? '请开始你的复习\r\n' : "无记录。。。"
            for (let data of datas) {
                res += `《${data.mainTheme}》（${data.mainTitle}）|${data.tag}|\n` + `\t${data.content}\r\n`
            }

            return res
        } else {
            throw Error('lack param')
        }
    } else {
        let times = 7
        let datas = await instance.mysqlHelperIntance.searchReviewNote(times) //复习少于7次的笔记
        let res = datas.length ? '请开始你的复习\r\n' : "随机复习\r\n"
        if (datas.length) {
            for (let data of datas) {
                let trigTime = dayjs(data.createTime, "YYYYMMDDhhmmss").add(8 * Math.pow(2, data.reviewTimes)).format("YYYYMMDDhhmm")
                if (dayjs().isAfter(trigTime, 'minutes')) { //已经过了现在时间
                    res += `《${data.mainTheme}》（${data.mainTitle}）|${data.tag}|\n` + `\t${data.content}\r\n`
                }
            }

            tools.sendDingDingMsg('https://oapi.dingtalk.com/robot/send?access_token=339b73ac2ae39cc3cb7016b53a1cbd4dcc783f97a6248649bfef3dfeb38c88f6', res, ["13221160826"], [])

        } else {
            //以后再说  随机复习
        }
    }

}


module.exports = async function (info) {

    return await main(info)
}