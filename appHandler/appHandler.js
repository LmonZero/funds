const koaInterface = require('./interface_koa')

class appHandeler {
    constructor() {

    }

    init() {
        this.koaMgr = new koaInterface()
        this.koaMgr.init()
    }
}


module.exports = appHandeler

