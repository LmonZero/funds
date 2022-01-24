const tools = require('../lib/tools')
const tempCodeCfg = require('./loading_js/config')
const cronMgr = require('../lib/helper/helper_cron')
const util = require('util')
class loading extends cronMgr {
    constructor() {
        super()
        //目前只干加载code配置 后续增加定时任务
        this.scriptInfo = {
            cmdTable: {},
            // cmdClass: []
        }
    }
    init() {
        // tools.debug(tempCodeCfg)
        for (let scriptInfo of tempCodeCfg.scriptInfo) {
            // tools.debug(scriptInfo.name)
            // tools.debug(scriptInfo.main)

            try {
                let cmdClass = { key: 'p', name: '未知' }
                if (scriptInfo.group) {
                    let cmdClassArr = scriptInfo.group.split("-")
                    cmdClass.key = cmdClassArr[0] ? cmdClassArr[0] : cmdClass.key
                    cmdClass.name = cmdClassArr[1] ? cmdClassArr[1] : cmdClass.name
                }

                if (this.scriptInfo.cmdTable[cmdClass.key]) {

                } else {
                    this.scriptInfo.cmdTable[cmdClass.key] = {}
                    this.scriptInfo.cmdClass.push(cmdClass)
                }

                if (scriptInfo.name && scriptInfo.main) {
                    this.scriptInfo.cmdTable[cmdClass.key][scriptInfo.name] = {
                        mian: scriptInfo.main,
                        // reqFilePath: scriptInfo.reqFilePath,
                        description: scriptInfo.description
                    }
                    //定时任务
                    if (scriptInfo.times) {
                        scriptInfo.times.forEach((time, i) => {
                            this.createJob(`${cmdClass.key}-${scriptInfo.name}-${i}`, time, scriptInfo.main.bind(scriptInfo))
                        })
                    }
                }
                // tools.debug('--->', this.scriptInfo)
            } catch (error) {
                tools.error('error->', error, '\r\n', scriptInfo)
            }
        }
    }

    async run(info) {
        let res = null
        try {
            let main = this.getScript(info.cmd, info.param[0])
            if (main) {
                if (util.types.isAsyncFunction(main)) {
                    res = await main({ param: info.param.slice(1), content: info.content })
                } else {
                    res = main({ param: info.param.slice(1), content: info.content })
                }
            } else {
                tools.debug("没脚本？？？")
            }
        } catch (error) {
            tools.error('run error->', error)
        }
        return res
    }


    getScript(group, name) {
        let funcMain = null
        try {
            funcMain = this.scriptInfo.cmdTable[group][name]["mian"]
            // tools.debug('error->', filePath)
            // funcMain = require(filePath)
            // delete require.cache[require.resolve(this.scriptInfo.cmdTable[group][name]["reqFilePath"])]

        } catch (error) {
            tools.error(`${group}-${name}`, 'getScript error->', error)
        }
        return funcMain
    }

}


module.exports = loading