const helper_udp_peocess = require('../lib/helper/helper_udp_process')
const { spawn } = require('child_process');
const tools = require('../lib/tools');
//管理子进程

class spawn_process extends helper_udp_peocess {
    constructor(port = 6666) {
        super()
        this.map_process_register_pid_port = {
            // "subPid": {
            //     port: 123
            //     isAlive:false
            //     groupName:'aa'
            // }
        }
        this.map_childProcess_group = {
            // "aa": [map_childProcess]
        }

        this.option = {
            stdio: 'inherit', //子进程的标准输入、标准输出和标准错误 inherit 直接到父进程
            cwd: './bin/subPython',
        }
        this.createUdp(port, this.msgProcessReqHanding.bind(this))
    }

    msgProcessReqHanding(msgId, msg, rinfo) {
        // console.log('msgProcessReqHanding->', msg)
        if (msg.cmd == 0) {
            //子进程注册请求
            this.changeChildStatus(msg.value.pid, true, rinfo.port)
        } else if (msg.cmd = 65535) {
            //我能监控
            // //子进程销毁通知
            // this.changeChildStatus(msg.value.pid, rinfo.port, false)
        } else {
            this.emit('processReq', msgId, msg, rinfo, this)
        }
    }

    spawn(cmd = 'echo', args = ['are you ok?'], processNum = 1, groupName = 'ayok') {
        if (!processNum) {
            processNum = 1
        }
        while (processNum--) {
            let childProcess = spawn(cmd, args, this.option)
            let pid = childProcess.pid
            // console.log('main=process', pid)

            if (this.map_process_register_pid_port[pid]) {
                tools.error('How can it be repeated--subPid', pid)
            } else {
                this.map_childProcess_group[groupName] instanceof Array ? this.map_childProcess_group[groupName].push(childProcess) : this.map_childProcess_group[groupName] = [childProcess]
                this.map_process_register_pid_port[pid] = { port: 0, isAlive: false, groupName: groupName }
                if (this.option.stdio != "inherit") {
                    childProcess.stdout.on('data', (data) => {
                        tools.debug('subPid-', pid, '-stdout:', data)
                    });
                    childProcess.stderr.on('data', (data) => {
                        tools.debug('subPid-', pid, '-stderr:', data)
                    });
                }
            }
            //监控child
            childProcess.once('exit', (code, signal) => {
                tools.debug('child-exit-->', code, '-', signal)
                this.changeChildStatus(childProcess.pid, false, 0)
            })
        }
    }

    spawns(spawns = [{ cmd: 'echo', args: ['are you ok?'], processNum: 1 }], groupName = 'ayok') {
        for (const spawn of spawns) {
            this.spawn(spawn.cmd, spawn.args, spawn.processNum, groupName)
        }
    }

    changeChildStatus(pid, isAlive, port) {
        if (isAlive) {
            if (this.map_process_register_pid_port[pid]) {
                this.map_process_register_pid_port[pid]["port"] = port
                this.map_process_register_pid_port[pid]["isAlive"] = isAlive
            } else {
                tools.error('no this pid info-->', pid)
            }

        } else {
            let groupName = this.map_process_register_pid_port[pid]["groupName"]
            let childs = this.map_childProcess_group[groupName]
            if (childs.length) {
                this.map_childProcess_group[groupName] = childs.filter((v) => {
                    if (v.pid != pid) {
                        return
                    } else {
                        try {
                            v.kill()
                        } catch (error) {
                            tools.error(v.pid, '--kill error')
                        }
                    }
                })
            } else {
                delete this.map_childProcess_group[groupName]
            }
            delete this.map_process_register_pid_port[pid]
        }
    }


}

module.exports = spawn_process