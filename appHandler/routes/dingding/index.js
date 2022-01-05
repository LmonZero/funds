const router = require('koa-router')();

router.post("/rebot", async (ctx) => {
    console.log(ctx)
    ctx.body = { 'ok': 300 }
})

module.exports = router.routes();