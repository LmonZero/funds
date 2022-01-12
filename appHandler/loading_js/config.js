module.exports = {
    scriptInfo: [
        {
            main: require('./funds/fundStt'),
            name: "fundStt",
            description: "(fundStt,...) 统计近期基金情况",
            group: "funds-基金类",
        }, {
            main: require('./test/test'),
            name: "atest",
            description: "(atest,...) 就试试，测测",
            group: "test-测试类",
        },
    ]
}