const { resolve } = require("path")
module.exports = {
    rootPath: resolve(__dirname),
    scriptInfo: [
        {
            filePath: "./funds/fundStt.js",
            name: "fundStt",
            description: "(fundStt,...) 统计近期基金情况",
            group: "funds-基金类",
        }, {
            filePath: "./test/test.js",
            name: "atest",
            description: "(atest,...) 就试试，测测",
            group: "test-测试类",
        },
    ]
}