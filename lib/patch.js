const os = require('os')
const type = os.platform()
const { spawn,exec } = require('child_process')
const iconv=require('iconv-lite')
const tools = require('../common/tools');


module.exports = {
    ping,
    isExit,
    memUse,
    diskUse,
    cpuUse
}

async function ping (ip) {
    let p= new Promise((reslove, reject) => {

        let args=['-n','3',ip]
        let encoding='gbk'
        if (type == 'linux') {
            args = ['-c', '3', '-i', '0.6', '-w', '3', ip]
            encoding='utf-8'
        }

        let childProcess = spawn('ping', args)
        let resData=''
        childProcess.stdout.on('data', (data) => {
            // console.log(`${childProcess.pid} end\r\n`,data)
            // reslove(data)
            resData+=iconv.decode(data,encoding)
        })
        childProcess.stderr.on('data', (data) => {
            // console.error(`${childProcess.pid} end\r\n`,data)
            // reject(data)
            resData+=iconv.decode(data,encoding)
        })

        childProcess.on('close', (code,sig) => {
            console.log('[close]',childProcess.pid, code, sig,'ping',args)
            // console.log(resData)

            reslove(resData)
        })
        childProcess.on('error', (error) => {
            console.log('[error]',childProcess.pid,'childProcess error!!!')
            reject(error)
        })

    })

    let str = await p 
    // console.log(str)
    tools.debug('\r\n',str)

    let matched=null
    let packet=null
    if (type == 'linux') { //英文
        matched =str.match(/min\/avg\/max\/mdev/g)
        packet = str.match(/[0-9]*(?=% packet loss)/g)
    } else { //windows  中文/英文
        matched = str.match(/往返行程的估计时间/g)||str.match(/Approximate round trip times in milli-seconds/g)
        packet = str.match(/(?<=丢失 = )[0-9]*/g)||str.match(/(?<=Lost = )[0-9]*/g)
    }
    tools.debug('内容匹配结果-->',matched,packet)
    if (matched) {
        if (packet[0] == '0') {
            return true
        }
    }

    return false
}

async function isExit (processName) { //linux
    let p= new Promise((reslove, reject) => {
        let resData = ''
        let encoding='utf-8'
        let ps = spawn('ps',['-ef'])
        let grep = spawn('grep',[processName])
        
        ps.stdout.on('data', (data) => {
            grep.stdin.write(data)
        })

        ps.stderr.on('data', (data) => {
            console.error(`ps stderr: ${iconv.decode(data,encoding)}`)
        })

        ps.on('close', (code) => {
            if (code != 0) {
                console.error(`ps process exited with code ${code}`)
            }
            grep.stdin.end();
        })
        ps.on('error', (e) => {
            console.error('ps error', e)
            reject(e)
        })

        grep.stdout.on('data', (data) => {
            resData+=iconv.decode(data,encoding)
        })

        grep.stderr.on('data', (data) => {
            resData+=iconv.decode(data,encoding)
        })

        grep.on('close', (code) => {
            reslove(resData)
        })

        grep.on('error', (e) => {
            console.error('grep error', e)
            reject(e)
        })

    })
    let str = await p 
    // console.log(str)
    tools.debug('\r\n',str)
    let match = str.match(RegExp(`./${processName}`, 'g'))
    tools.debug('内容匹配结果-->',match)
    if (match) {
        return true
    }
    return false
}

//计算内存使用率
function memUse() {
    let mem_total = os.totalmem();
    mem_free = os.freemem();
    mem_used = mem_total - mem_free;
    mem_ratio = 0;
    mem_total = mem_total / (1024 * 1024 * 1024);
    mem_used = mem_used / (1024 * 1024 * 1024);
    mem_ratio = mem_used / mem_total * 100;
    return Math.floor(mem_ratio)
}
//计算磁盘使用率
function diskUse () {
    return new Promise((reslove, reject) => {
        if (type == "win32") {
            exec("wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list", (err, stdout, stderr) => {
                if (err) reject(err)
                // console.log(stdout)
                try {
                    let lines = stdout.split('\r\r\n');
                    // console.log(lines)
                    let free = 0
                    let sum=0
                    for (let line of lines) {
                        if (line != '') {
                            words = line.split('=')
                            // console.log(words)
                            if (words[0] == 'FreeSpace') {
                                free+=parseInt(words[1])
                            } else if (words[0] == 'Size') {
                                sum+=parseInt(words[1])
                            }
                        }
                    }
                    reslove(Math.floor((sum-free)/sum*100))
                } catch (error) {
                    reject(error)
                }
            })   
        } else {
            exec("df -P | awk 'NR > 1'", (err, stdout, stderr) => {
                if (err) reject(err)
                try {
                    // console.log(stdout)
                    let lines = stdout.split('\n')
                    // console.log(lines)
                    let sum = 0
                    let used =0
                    for (let line of lines) {
                        if (line != '') {
                            words = line.replace(/ +(?= )/g, '').split(' ')
                            sum +=parseInt(words[1])
                            used +=parseInt(words[2])
                        }
                    }
                    console.log('used',used)//k
                    console.log('sum',sum)
                    // console.log((used / sum * 100).toFixed())
                    reslove(Math.floor(used / sum * 100))   
                } catch (error) {
                    reject(error)
                }
            })   
        }
    })
}
//cpu使用率
function cpuUse (afterTime=1) { //默认计算接下来1s内的cpu使用率
    function getAllCpu () {
        const cpus = os.cpus()
        let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;
        for (let cpu of cpus) {
            user += cpu.times.user
            nice += cpu.times.nice
            sys += cpu.times.sys
            idle += cpu.times.idle
            irq += cpu.times.irq
        }
        total += user + nice + sys + idle + irq
        return {
            user,
            sys,
            idle,
            total
        }
    }
    if (afterTime < 0.8) {
        afterTime=0.8
    }
    return new Promise((reslove, reject) => {
        try {
            const t1=getAllCpu()

            setTimeout(() => {
                try {
                    const t2 = getAllCpu()
                    let use = 1 - ((t2.idle - t1.idle) / (t2.total - t1.total))
                    console.log('cpuUse---------',use)
                    reslove(Math.ceil(use*100))

                } catch (error) {
                    reject(error)
                }
            }, afterTime * 1000)
            
        } catch (error) {
            reject(error)
        }

    })

}

// ping('172.16.34.204')
// 15283984
// 15296125
// isExit('HMSncc')

// cpuUse().then(v => {
//     console.log(v)
// })

// while (1){
    
// }