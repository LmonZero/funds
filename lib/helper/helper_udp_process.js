const dgram = require('dgram');
const tools = require('../tools')
const events = require('events')
//通讯层+协议层

//不大于64KB  先这样吧！！
//协议 (udp通讯)
//报文  标志位1+msgId+msg+（msgMd5）
//标志位1  0 请求  1 应答  1字节
//msgId   递增数    5字节
//msg 数据体  未知字节
//msgMd5   16字节 (暂时不需要吧 反正又不分包)
//


//既是客户端又是服务端
class udp extends events {
    constructor() {
        super()
        this.socket = dgram.createSocket('udp4');
        this.msgId = 0
        this.callBacks = {}

    }

    createUdp(port = 6666, msgHanding = (msgId, msg, rinfo) => { }, isListening = true) {
        this.socket.on('error', (err) => {
            tools.debug(`error:\n${err}`);
            this.socket.close();
        });

        this.socket.on('message', (msg, rinfo) => { // 理论 max 65505字节
            // tools.debug(`got: ${msg} from ${rinfo.address}:${rinfo.port}`);
            this.listenMessage(msg, rinfo, msgHanding)
        });

        if (isListening) {
            this.socket.on('listening', () => {
                let address = this.socket.address();
                tools.debug(`listening ${address.address}:${address.port}`);
            });
        }

        this.socket.bind(port)
    }


    sendReq(ack = false, data, port, addr = '127.0.0.1', time = 1) {
        return new Promise((reslove, reject) => {
            let msgId = ++this.msgId > 70000 ? 0 : this.msgId

            if (typeof data === "object") {
                this.sendMsg(0, msgId, JSON.stringify(data), port, addr, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        if (ack) {
                            let timer = setTimeout(reject, time * 1000, `port:${port}-timeOut`)
                            let timeOut = (msg) => {
                                clearTimeout(timer)
                                delete this.callBacks[msgId]

                                try {
                                    reslove(JSON.parse(msg))
                                } catch (error) {
                                    reject('port->', port, err)
                                }
                            }
                            this.callBacks[msgId] = timeOut
                        } else {
                            reslove("send ok")
                        }
                    }

                })
            } else {
                reject('data is not object')
            }
        })
    }

    sendRes(msgId, data, port, addr = '127.0.0.1') {
        return new Promise((reslove, reject) => {
            if (typeof data === "object") {

                this.sendMsg(1, msgId, JSON.stringify(data), port, addr, (err) => {
                    if (err) {
                        reject("res port err-", err)
                    } else {
                        reslove(true)
                    }

                })
            } else {
                reject("res data is not object")
            }
        })
    }

    sendMsg(flag1, msgId, msg, port, addr = '127.0.0.1', sendedBack = () => { }) {
        //报文  标志位1+标志位2+msgId+msg+（msgMd5）
        //标志位1  0 请求  1 应答  1字节
        //msgId   递增数    5字节
        //msg 数据体  未知字节
        //msgMd5   16字节 (暂时不需要吧 反正又不分包)
        let tMsg = `${flag1}${tools.padZero(msgId, 5)}${msg}`
        this.socket.send(tMsg, 0, tMsg.length, port, addr, sendedBack);
    }

    //消息处理
    listenMessage(msgBuf, rinfo, msgHanding) {
        let tmp = `${msgBuf}`
        let flag1 = tmp.slice(0, 1)
        let msgId = parseInt(tmp.slice(1, 6))
        let msg = tmp.slice(6, tmp.length)

        if (flag1 == 0) {//请求
            msgHanding(msgId, JSON.parse(msg), rinfo)
        } else {//应答
            let timeOut = this.callBacks[msgId]
            if (timeOut) {
                timeOut(msg)
            }
        }

    }

}

module.exports = udp


