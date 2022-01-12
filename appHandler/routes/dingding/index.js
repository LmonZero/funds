const tools = require('../../../lib/tools');

const router = require('koa-router')();


// {
//   conversationId: 'cidOWN+kh2kmRPaPWbC9Dm1bQ==',
//   atUsers: [ { dingtalkId: '$:LWCP_v1:$znAU0xRHLBPb5y3TlpBwrLtCDuQ6r/ZC' } ],
//   chatbotUserId: '$:LWCP_v1:$znAU0xRHLBPb5y3TlpBwrLtCDuQ6r/ZC',
//   msgId: 'msgOamHieIoEH2L7feRb38dtQ==',
//   senderNick: '林喜钦',
//   isAdmin: false,
//   sessionWebhookExpiredTime: 1641808405290,
//   createAt: 1641803005036,
//   conversationType: '2',
//   senderId: '$:LWCP_v1:$Jkiww7n5Ryk9Gd/LSmH+Xg==',
//   conversationTitle: 'lmon小天才助手-TEST',
//   isInAtList: true,
//   sessionWebhook: 'https://oapi.dingtalk.com/robot/sendBySession?session=52498f861dc6c9eb0ff5d74e8b603572',
//   text: { content: ' [help]' },
//   robotCode: 'normal',
//   msgtype: 'text'
// }

router.post("/rebot", async (ctx) => {
    // console.log(ctx.request.body)
    let body = ctx.request.body
    try {
        let content = await instance.appHandelerInstance.rebootParse(body.text.content, body.conversationTitle, body.senderNick)
        ctx.body = body
        ctx.body.text = { content: content }
    } catch (error) {
        tools.error('/rebot error->', error)
    }

})

module.exports = router.routes();