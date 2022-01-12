const x = require('./a')
function a() {
    try {
        delete require.cache[require.resolve('./a')]
        console.log(require.cache)
        console.log('>>>>', x)
        // console.log(require.cache)
    } catch (error) {
        console.log('error->', error)
    }
}

a()
