const tools = require('../lib/tools')
const koaInterface = require('./interface_koa')
const loadingJs = require('./interface_loadIng_js')

class appHandeler {
    constructor() {

    }

    init() {
        this.koaMgr = new koaInterface()
        this.koaMgr.init()
        this.loadingJs = new loadingJs()
        this.loadingJs.init()
        // this.cmdTable = {
        //     "funds": {
        //         "myFun": {
        //             instructions: '查询基金近n天涨幅情况',
        //             func: (n) => {

        //             }
        //         }
        //     },
        //     "notes": {

        //     }
        // }

        // this.cmdClass = [
        //     {
        //         name: "基金类",
        //         cmd: '[help](funds)'
        //     },
        //     {
        //         name: "笔记类",
        //         cmd: '[help](notes)'
        //     }
        // ]
    }

    async rebootParse(msg, whoRebot, whoSend) {
        // tools.debug(msg)
        let res = `很抱歉哦!【${whoRebot}】我听不懂你在讲什么,请尝试输入[help]`
        try {
            let cmdinfo = this.parseMsg(msg)
            cmdinfo.whoRebot = whoRebot
            cmdinfo.whoSend = whoSend
            tools.debug('parseInfo-->', cmdinfo)
            if (cmdinfo.cmd) {
                switch (cmdinfo.cmd) {
                    case "help": {
                        if (cmdinfo.param.length) {
                            let group = cmdinfo.param[0]
                            if (this.loadingJs.scriptInfo.cmdTable[group]) {
                                res = ''
                                for (let name in this.loadingJs.scriptInfo.cmdTable[group]) {
                                    let scriptInfo = this.loadingJs.scriptInfo.cmdTable[group][name]
                                    res += `${scriptInfo.description}\n\t查询指令：[${group}(${name})]\n`
                                }
                            }
                        } else {
                            res = ''
                            for (let cmdClass of this.loadingJs.scriptInfo.cmdClass) {
                                res += `${cmdClass.name}\n\t查询指令：[help(${cmdClass.key})]\n`
                            }
                        }
                        break;
                    }
                    default: {
                        let temp = await this.loadingJs.run(cmdinfo)
                        res = temp ? temp : res
                    }
                }
            } else {
                // tools.error('no cmd')
                // res = `很抱歉哦!【${whoRebot}】我听不懂你在讲什么,请尝试输入[help]`
            }
        } catch (error) {
            tools.error("rebootParse error->", error)
        }

        return res
    }

    parseMsg(msg) {
        let res = {
            cmd: "",
            param: [],
            content: ''
        }
        let infos = msg.match(/(?<=^\s*\[)[\u4e00-\u9fa5\w]*(\([\w,-.\u4e00-\u9fa5]*\))?(?=\])/g)
        if (infos) {
            let info = infos[0]
            let cmd = info.match(/^[\u4e00-\u9fa5\w]*/g)
            if (cmd) {
                res.cmd = cmd[0]
            }

            let param = info.match(/(?<=\()[\w,-.\u4e00-\u9fa5]*(?=\))/g)
            if (param) {
                res.param = param[0].split(',')
            }
        }
        let content = msg.match(/(?<=^\s*\[[\u4e00-\u9fa5\w]*(\([\w,-.\u4e00-\u9fa5]*\))?\])(.|\n)*/g)
        content = content ? content[0] : ''
        res.content = content.replace(/^\s+|\s+$/g, '')//去除头尾换行符
        return res
    }
}


module.exports = appHandeler

