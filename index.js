const tools = require('./lib/tools')
const appHandeler = require('./appHandler/appHandler')
// const mysqlHelper = require('./lib/helper/helper_mysql')

function main() {
    // const mysql = new mysqlHelper()
    let appHandelerInstance = new appHandeler()
    appHandelerInstance.init()
}

main()