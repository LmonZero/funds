const info = require('./info')
const request = require('request')
const exec = require('child_process').exec;
var tools = {
    info: info.verInfo,
    debug: function () {
        let [h, ...e] = Array.prototype.slice.call(arguments)
        console.log(h, ...e)
    },
    error: function () {
        let [h, ...e] = Array.prototype.slice.call(arguments)
        console.error(h, ...e)
    },
    getMd5Buffer: function (data) {
        var crypto = require('crypto');
        var h = crypto.createHash('md5');
        h.update(data);

        var md5 = h.digest();
        return md5;
    },
    getDingDingRobtReqUrl: function (webHockUrl, secret) {
        let crypto = require('crypto');
        let time = Date.now();//当前时间

        let stringToSign = time + "\n" + secret;
        let base = crypto.createHmac('sha256', secret).update(stringToSign).digest('base64');

        let sign = encodeURIComponent(base)//签名
        let url = webHockUrl + `&timestamp=${time}&sign=${sign}`;
        return url;
    },
    execCmd: function (cmdStr, timeOut = 60) {
        return new Promise((resolve, reject) => {
            let timer = setTimeout(reject, timeOut * 1000, "timeOut")
            exec(cmdStr, (error, stdout, stderr) => {
                clearTimeout(timer)
                if (error) {
                    reject(error);
                } else {
                    if (stdout) {
                        resolve(stdout);
                    } else {
                        resolve(stderr);
                    }
                }
            })
        })
    },
    ipIsOK: async function (ip) {
        return new Promise((reslove, reject) => {
            this.execCmd(`ping ${ip}`).then(v => reslove(true)).catch(e => reject(e))
        })
    },
    padZero: function (num, len) {
        return (Array(len).join('0') + num).slice(-len);
    },
    requestHttp: function (url, body, method = 'post', options = { json: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', } }) {
        return new Promise((resolve, reject) => {
            if (method == "get") {
                options.useQuerystring = true
                options.qs = body
                request.get(url, options, function (err, res, body) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(body)
                    }
                })
            } else {
                options.body = body
                request.post(url, options, function (err, res, body) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(body)
                    }
                })
            }
        })

    },
    jsonIni: function (path) {
        let res = {}
        try {
            const fs = require('fs')
            res = JSON.parse(fs.readFileSync(path))
            for (let key in res) {
                if (key.slice(0, 2) == "//") {
                    delete res[key]
                }
            }
        } catch (error) {
            this.error('jsonIni err->', error)
        }
        return res
    }
};
tools.info(true)
module.exports = tools;