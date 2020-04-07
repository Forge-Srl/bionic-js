const {File} = require('./File')
const path = require('path')
const {nativeObjectClassName} = require('../schema/notable/NativeObjectClass')

class BjsNativeObjectPackageFile extends File {

    static build(targetConfig) {
        const filePath = path.resolve(targetConfig.packageDirPath, `${nativeObjectClassName}.js`)
        return new BjsNativeObjectPackageFile(filePath, targetConfig.packageDirPath)
    }

    async generate(hostProject) {
        const nativeObjectClassSource =
            'class BjsNativeObject {\n' +
            '\n' +
            '    constructor(...params) {\n' +
            '        this.constructor.bjsNative.bjsBind(this, ...params)\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            'module.exports = {BjsNativeObject}'
            await hostProject.setPackageFileContent(this.relativePath, nativeObjectClassSource)
    }
}

module.exports = {BjsNativeObjectPackageFile}