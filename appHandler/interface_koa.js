const Koa = require('koa');
const tools = require('../lib/tools');
const Router = require('koa-router');

const indexRouter = require('./routes');

class KoaManager {

    constructor() {
        //this.tokenSecret = 'pello_token_sc'；
        //token 认证使用 webMgr处理
    }

    init() {
        this.startKoa();
    }

    startKoa() {
        const app = new Koa();

        var router = new Router();
        router.use('/', indexRouter);
        app.use(router.routes()) //启动路由
        app.use(router.allowedMethods())//可设也可以不设，建议设置

        let webPort = 9090;
        app.listen(webPort, () => {
            tools.debug(`hmSoc is listening ${webPort} port`);
        })
    }

}

module.exports = KoaManager;
