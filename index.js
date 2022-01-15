const tools = require('./lib/tools')
const path = require('path')
const appHandeler = require('./appHandler/appHandler')
const mysql = require('./appHandler/interface_mysql')
// const iniConfig = require('./lib/helper/helper_ini');
// const NodeRSA = require('node-rsa');
function main() {

    let mysqlHandelerIntance = new mysql()
    let appHandelerInstance = new appHandeler()
    global.instance = {
        appHandelerInstance: appHandelerInstance,
        mysqlHelperIntance: mysqlHandelerIntance
    }

    mysqlHandelerIntance.init()
    appHandelerInstance.init()
}

main()