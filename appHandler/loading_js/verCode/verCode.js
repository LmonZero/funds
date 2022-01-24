const tools = require('../../../lib/tools')
const dayjs = require('dayjs')

function hmSuper() {
    let meanDate = dayjs().format('YYYYMM0') + parseInt((dayjs().date() / 7));
    let meanfulStr = 'David$2007&Sinc1995@' + meanDate + 'HmMachine';
    let meadDate = tools.getMd5Buffer(meanfulStr).toString('HEX');
    let dRet = parseInt(meadDate.slice(0, 5), 16);
    return dRet
}


module.exports = async function (info) {
    return hmSuper()
}