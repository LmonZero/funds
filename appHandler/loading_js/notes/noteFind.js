
async function main(info) {

    let datas = await instance.mysqlHelperIntance.searchNote(...info.param)
    let res = datas.length ? '恭喜！查询成功\r\n' : "无记录。。。"
    for (let data of datas) {
        res += `【${data.mainTheme}】{${data.mainTitle}}(${data.tag})\r\n` + `${data.content}`
    }

    return res
}


module.exports = async function (info) {
    if (info.param.length >= 1) {
        return await main(info)
    } else {
        throw Error('lack param')
    }
}