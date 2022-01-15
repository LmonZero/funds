
async function main(info) {

    let tableInfo = {
        mainTheme: info.param[0],
        mainTitle: info.param[1],
        tag: info.param[2],
        content: info.content
    }

    await instance.mysqlHelperIntance.insterTable(tableInfo, 'notes')
    let res = '恭喜！记录成功'
    return res
}


module.exports = async function (info) {
    if (info.param.length >= 2 && info.content) {
        return await main(info)
    } else {
        throw Error('lack param')
    }
}