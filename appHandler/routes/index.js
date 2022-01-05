const tools = require('../../lib/tools');

const router = require('koa-router')();
const dingding = require('./dingding')

router.get('/', async (ctx, next) => {
    tools.debug('hello');
})


router.use('dingding', dingding);

module.exports = router.routes();