const tools = require('./lib/tools')
const appHandeler = require('./appHandler/appHandler')

function main() {
    // const mysql = new mysqlHelper()
    let appHandelerInstance = new appHandeler()
    appHandelerInstance.init()
    global.instance = {
        appHandelerInstance: appHandelerInstance,
        mysqlHelperIntance: mysqlHelperIntance
    }
}

main()