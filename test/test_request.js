
const tools = require('../lib/tools')
const fs = require('fs')
const dingding = require('../lib/dingding')
const path = require("path")
// let test = fs.readFileSync("test.json", 'utf8')
// // console.log(test)
// let t1 = process.hrtime()
// console.log(t1)
// let reg = RegExp(`{[^(bzdm)]*"bzdm":"(011446||011447||400015)"[^}]*}`, 'g')
// console.log(reg)
// console.log(test.match(reg))
// let t2 = process.hrtime()
// console.log(t2)
// console.log(t2[1] - t1[1])
// console.log((t2[1] - t1[1]) / 1000000000)


// 单位净值走势
// 每隔几天统计一次 , 多少个几天
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


// fund_em_value_estimation
// {
//     "基金代码",                         "bzdm": "005453",
//     "-",                         "ListTexch": "",
//     "-",                         "FScaleType": "",
//     "-",                         "PLevel": 105.0,
//     "-",                         "JJGSID": "80280038",
//     "-",                         "IsExchg": "0",
//     "基金类型",                         "FType": "混合型-灵活",
//     "-",                         "Discount": 1.0,
//     "-",                         "Rate": "0.15%",
//     "-",                         "feature": "215,701",
//     "-",                         "fundtype": "002",
//     "估算日期",                         "gxrq": "2021-12-24",
//     "-",                         "jjlx3": null,
//     "-",                         "IsListTrade": "0",
//     "-",                         "jjlx2": null,
//     "-",                         "shzt": null,
//     "_",                         "sgzt": "开放申购",
//     "-",                         "isbuy": "1",
//     "-",                         "gzrq": "2021-12-23",
//     "估算偏差",                         "gspc": "0.45%",
//     f"{cal_day}-估算数据-估算值",                         "gsz": "2.2442",
//     f"{cal_day}-估算数据-估算增长率",                         "gszzl": "-0.27%",
//     f"{cal_day}-公布数据-日增长率",                         "jzzzl": "-0.72%",
//     f"{value_day}-单位净值",                         "dwjz": "2.2502",
//     f"{cal_day}-公布数据-单位净值",                         "gbdwjz": "2.2340",
//     "-",                         "jjjcpy": "QHKYYLJKA",
//     "基金名称",                         "jjjc": "前海开源医疗健康A",
//     "-",                         "jjlx": null,
//     "-",                         "gszzlcolor": "ui-table-down",
//     "-",                         "jzzzlcolor": "ui-table-down"
// },


// let needFundCodes = ["008087", "163402"]
let url = "http://api.fund.eastmoney.com/FundGuZhi/GetFundGZList"
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
    "Referer": "http://fund.eastmoney.com/",
}

let time = new Date()
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
        let iniFile = path.join(__dirname, 'fund.json')
        console.log(__dirname, __filename, iniFile)
        console.log(path.resolve('fund.json'))
        let ini = tools.jsonIni(iniFile)
        console.log(ini)
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
                funds[code].recent = await netValueMovements(code)
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

        // console.log(content)
        dingding.sendDingdingMsg(content, ["13221160826"])

    })
    .catch(e => console.log(e))


// netValueMovements("008087")

// console.log(new Array(14).fill(0, 0, 14))