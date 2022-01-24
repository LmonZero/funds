const tools = require('../../../lib/tools')
let url = "http://api.fund.eastmoney.com/FundGuZhi/GetFundGZList"
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
    "Referer": "http://fund.eastmoney.com/",
}
let time = new Date()
function netValueMovements(code, day = 2, times = 7) {
    return new Promise((reslove, reject) => {
        // let time = new Date()
        let url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`
        let headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
        }
        tools.requestHttp(url, {}, 'get', { headers })
            .then((v) => {
                // fs.writeFileSync('./test.json', v)
                // let codes = needFundCodes.join('|')
                let reg = RegExp('(?<=Data_netWorthTrend\\s?=\\s?)\\[({.*?},?)*\\]', 'g')
                console.log(reg)
                // console.log(v.match(reg))
                let data = JSON.parse(v.match(reg)[0])
                let temp = data.slice(data.length - day * times, data.length)
                movementArr = new Array(times).fill(0, 0, times)
                for (let i = 0; i < temp.length; i++) {
                    let index = Math.floor(i / 2)
                    // console.log(index)
                    // console.log(movementArr[index])
                    // console.log(temp[temp.length - 1 - i])
                    for (let j = 0; j <= index; j++) {
                        movementArr[j] = parseFloat((parseFloat(movementArr[j]) + parseFloat(temp[i]["equityReturn"])).toFixed(2))
                    }
                }
                // console.log(movementArr)
                // console.log(movementArr.reverse())
                reslove(movementArr.reverse())
            })
            .catch(e => reject(e))
    })
}

function main(day = 2, times = 7, max = null) {
    return new Promise((reslove, reject) => {
        tools.requestHttp(url, {
            "type": 1,
            "sort": "3",
            "orderType": "asc",
            "canbuy": "0",
            "pageIndex": "1",
            "pageSize": "30000",
            "_": time.getTime(),
        }, 'get', { headers })
            .then(async (v) => {
                // fs.writeFileSync('./test.json', v)
                // let iniFile = path.join(__dirname, 'fund.json')
                // console.log(__dirname, __filename, iniFile)
                // console.log(path.resolve('fund.json'))
                // let ini = tools.jsonIni(iniFile)
                // console.log(ini)
                let optionalFunds = await instance.mysqlHelperIntance.optionalFunds()
                let ini = {}
                for (let funds of optionalFunds) {
                    ini[funds.fundCode] = {
                        name: funds.fundName,
                        max: max != null ? parseFloat(max).toFixed(2) : funds.max
                    }
                }
                let needFundCodes = Object.keys(ini)
                let codes = needFundCodes.join('|')
                let reg = RegExp(`{[^(bzdm)]*"bzdm":"(${codes})"[^}]*}`, 'g')
                console.log(reg)
                // console.log(v.match(reg))
                let datas = v.match(reg)
                let funds = {}
                for (let d of datas) {
                    let temp = JSON.parse(d)
                    let code = temp["bzdm"]
                    if (code) {
                        funds[code] = {
                            rate: temp['gszzl'],
                            name: temp["jjjc"],
                            recent: []
                        }
                        funds[code].recent = await netValueMovements(code, parseInt(day), parseInt(times))
                    }
                }
                console.log(funds)

                //进行逻辑分析
                let content = ''
                for (let code in funds) {
                    let max = ini[code].max
                    let fund = funds[code]
                    let f = fund.recent.filter(v => parseFloat(v) < parseFloat(max))
                    if (f.length) {
                        let recent = fund.recent.map((v, index) => {
                            return `【${(index + 1) * 2}day】${v}`
                        })
                        content += `${code}-${fund.name}（${fund.rate}）(max:${max}):\n${recent.join('\t')}\r\n`
                    }
                }
                reslove(content)
                // console.log(content)
                // dingding.sendDingdingMsg(content, ["13221160826"])

            })
            .catch(e => reject(e))

    })

}


module.exports = async function (info) {
    if (info) {
        return await main(...info.param)
    } else {
        let content = await main()
        tools.sendDingDingMsg('https://oapi.dingtalk.com/robot/send?access_token=339b73ac2ae39cc3cb7016b53a1cbd4dcc783f97a6248649bfef3dfeb38c88f6', content, ["13221160826"], [])
    }
}