module.exports = {
    scriptInfo: [
        {
            main: require('./funds/fundStt'),
            // reqFilePath: require.resolve('./funds/fundStt'),
            name: "fundStt",
            description: "(fundStt,隔几天！,计次！,最大值！) 统计近期基金情况",
            group: "funds-基金类",
        }, {
            main: require('./test/test'),
            // reqFilePath: require.resolve('./test/test'),
            name: "atest",
            description: "(atest,...) 就试试，测测",
            group: "test-测试类",
        }, {
            main: require('./notes/noteAdd'),
            name: "add",
            description: "(add,主题！,内容标题！,标签-标签-。。?) 记录笔记",
            group: "note-基金类",
        }
    ]
}