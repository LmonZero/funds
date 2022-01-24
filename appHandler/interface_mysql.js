const mysqlHelper = require('../lib/helper/helper_mysql');
const tools = require('../lib/tools');

class mysqlInterface {
    constructor() {
    }
    init(cfg = { host: '127.0.0.1', user: "root", password: "lmon.com", database: 'lmonFund' }) {
        this.mysqlHelper = new mysqlHelper()
        this.mysqlHelper.init(cfg)
        this.dbTest()
    }

    async beginTrans() {

        var dbConn = null;
        try {
            dbConn = await this.mysqlHelper.beginTrans()
        } catch (error) {
            throw (error)
        }
        return dbConn
    }

    async commitTrans(dbConn) {
        try {
            await this.mysqlHelper.commit(dbConn)
        } catch (error) {

            throw (error)
        }
    }

    async rollback(dbConn) {
        try {
            await this.mysqlHelper.rollback(dbConn)
        } catch (error) {
            tools.error('[Error] --- pello transaction db error when rollback', error)
        }
    }

    async runSqlInTrans(sql, sqlParam, dbConn) {
        var arr = null;
        try {
            arr = await this.mysqlHelper.dbOpInTrans(sql, sqlParam, dbConn)
        } catch (error) {
            throw (error)
        }
        return arr
    }

    async dbop(sql) {
        return await this.mysqlHelper.dbOp(sql);
    }

    async dbTest() {
        let sql = 'show table status;';
        let arr = await this.dbop(sql);
        console.log('dbtest table length is -> ', arr.length);
    }

    async optionalFunds() {
        let sql = `select * from optionalFunds where isUse=1`
        return await this.dbop(sql);
    }

    async insterTable(obj, tableName) {
        let sql = `insert into ${tableName} (${Object.keys(obj).join(',')}) values ('${Object.values(obj).join("','")}')`
        tools.debug('sql->', sql)
        await this.dbop(sql)
    }

    async searchNote(tag, mainTitle, mainTheme, content) {
        let sql = `select * from notes`
        let temp = []
        if (tag) {
            temp.push(`tag like "%${tag}%"`)
        }
        if (mainTitle) {
            temp.push(`mainTitle ="${mainTitle}"`)
        }
        if (mainTheme) {
            temp.push(`mainTheme = "${mainTheme}"`)
        }
        if (content) {
            temp.push(`content like "%${content}%"`)
        }
        if (temp.length > 0) {
            sql += ` where (${temp.join(' or ')})`
        }
        tools.debug('sql->', sql)
        return await this.dbop(sql)
    }
}

module.exports = mysqlInterface
