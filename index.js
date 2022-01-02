const tools = require('./lib/tools')
const mysqlHelper = require('./lib/helper/helper_mysql')


function main() {
    const mysql = new mysqlHelper()

}

main(tools.info(true))