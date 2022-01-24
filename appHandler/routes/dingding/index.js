const tools = require('../../../lib/tools');

const router = require('koa-router')();


// {
//    conversationId: 'cidaye6xA8rilb2GRGxNTLy/g==',
//   sceneGroupCode: 'project',
//   atUsers: [ { dingtalkId: '$:LWCP_v1:$5mVxUMOu7arbuvLRwar1JEjwLyLGgjCc' } ],
//   chatbotCorpId: 'dingeee1db426a0288e8ee0f45d8e4f7c288',
//   chatbotUserId: '$:LWCP_v1:$5mVxUMOu7arbuvLRwar1JEjwLyLGgjCc',
//   msgId: 'msgPgrPskkUlJ0YuPE9zlUpOA==',
//   senderNick: '林喜钦',
//   isAdmin: true,
//   senderStaffId: '176568060226202209',
//   sessionWebhookExpiredTime: 1643004955657,
//   createAt: 1642999555397,
//   senderCorpId: 'dingeee1db426a0288e8ee0f45d8e4f7c288',
//   conversationType: '2',
//   senderId: '$:LWCP_v1:$Jkiww7n5Ryk9Gd/LSmH+Xg==',
//   conversationTitle: '这是一个很神秘的群',
//   isInAtList: true,
//   sessionWebhook: 'https://oapi.dingtalk.com/robot/sendBySession?session=50143ef4da0759f8767caad4931641c8',
//   text: {
//     content: 'https://oapi.dingtalk.com/robot/sendBySession?session=50143ef4da0759f8767caad4931641c8 '
//   },
//   robotCode: 'dinguju4o7sbhlfatz7d',
//   msgtype: 'text'
// }

router.post("/rebot", async (ctx) => {
    console.log(ctx.request.body)
    let body = ctx.request.body
    try {
        let content = await instance.appHandelerInstance.rebootParse(body.text.content, body.conversationTitle, body.senderNick)
        // ctx.body = body
        // ctx.body.text = { content: content }
        tools.sendDingDingMsg(body.sessionWebhook, content, [], [body.senderStaffId])

    } catch (error) {
        tools.error('/rebot error->', error)
    }

})

module.exports = router.routes();