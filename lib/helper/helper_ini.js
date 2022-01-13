//
var fs = require('fs');
var ini = require('ini');

class IniConfig {
    constructor(path) {
        this.filePath = path;
    }

    async read() {
        var fileContent = await this.readFile();
        var config = ini.parse(fileContent);
        return config;
    }

    readFile() {
        return new Promise((resolve, reject) => {
            if (!this.filePath) {
                reject(new Error('No filePath'));
                return;
            }

            fs.readFile(this.filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(data);
                }
            });
        });
    }

    async write(obj) {
        var str = ini.stringify(obj);
        //var str = ini.stringify(obj, { section: 'section' });
        await this.writeFile(str);
    }

    writeFile(str) {
        return new Promise((resolve, reject) => {
            if (!this.filePath) {
                reject(new Error('No filePath'));
                return;
            }

            fs.writeFile(this.filePath, str, (err) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = IniConfig;