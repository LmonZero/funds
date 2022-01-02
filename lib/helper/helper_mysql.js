
var mysql = require('mysql');
var tools = require('../tools');



class MysqlHelper {
    constructor() {

    }

    async init(connectionInfo, bUsePool = true) {
        this.connectionInfo = connectionInfo;
        this.bUsePool = !!bUsePool;
        if (this.bUsePool) {
            this.pool = mysql.createPool(this.connectionInfo);
        }
    }

    getConnectionFromPool() {
        var promise = new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    tools.error('[getConnection error] - ' + err.message);
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        return promise;
    }

    async dbOp(sql, sqlParam) {
        var connection = null;
        if (this.bUsePool) {
            connection = await this.getConnectionFromPool();
        } else {
            connection = mysql.createConnection(this.connectionInfo);
        }

        return await this.dbOp1(sql, sqlParam, connection);
    }

    async beginTrans() {
        var connection = null;
        if (this.bUsePool) {
            connection = await this.getConnectionFromPool();
        } else {
            connection = mysql.createConnection(this.connectionInfo);
        }

        return await this.beginTrans1(connection);
    }

    runSqlInTrans(sql, sqlParam, connection) {
        var promise = new Promise((resolve, reject) => {
            connection.query(sql, sqlParam, (err, result) => {
                if (err) {
                    tools.error('[dbOpInTrans error] - ' + err.message);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return promise;
    }

    commit(connection) {
        var promise = new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    tools.error('[beginTrans error] - ' + err.message);
                    reject(err);
                } else {
                    resolve(connection);
                }

                if (this.bUsePool) {
                    this.pool.releaseConnection(connection);
                } else {
                    //connection.end();
                    connection.destroy();
                }
            });
        });

        return promise;
    }

    rollback(connection) {
        var promise = new Promise((resolve, reject) => {
            connection.rollback((err) => {
                if (err) {
                    tools.error('[beginTrans error] - ' + err.message);
                    reject(err);
                } else {
                    resolve(connection);
                }

                if (this.bUsePool) {
                    this.pool.releaseConnection(connection);
                } else {
                    //connection.end();
                    connection.destroy();
                }
            });
        });

        return promise;
    }




    dbOp1(sql, sqlParam, connection) {
        var promise = new Promise((resolve, reject) => {
            connection.query(sql, sqlParam, (err, result) => {
                if (err) {
                    tools.error('[dbOp1 error] - ' + err.message);
                    //connection.destroy();
                    reject(err);
                } else {
                    //connection.destroy();
                    resolve(result);
                }

                if (this.bUsePool) {
                    this.pool.releaseConnection(connection);
                } else {
                    //connection.end();
                    connection.destroy();
                }
            });
        });

        return promise;
    }

    beginTrans1(connection) {
        var promise = new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err) {
                    tools.error('[beginTrans1 error] - ' + err.message);
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        return promise;
    }
}

module.exports = MysqlHelper;