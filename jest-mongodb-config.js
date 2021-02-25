/* module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest'
        },
        binary: {
            version: '4.0.3',
            skipMD5: true
        },
        autoStart: false
    }
} */

module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: '4.4.1',
            skipMD5: true
        },
        autoStart: false,
        instance: {}
    }
}