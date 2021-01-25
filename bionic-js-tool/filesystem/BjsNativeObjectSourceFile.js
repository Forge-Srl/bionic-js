const {nativeObjectBaseClassName} = require('../schema/Class')
const path = require('path')
const {CodeBlock} = require('../generation/code/CodeBlock')
const {posixPath} = require('./posixPath')

class BjsNativeObjectSourceFile {

    static build(guestDirPath) {
        return new BjsNativeObjectSourceFile(posixPath(path.resolve(guestDirPath, `${nativeObjectBaseClassName}.js`)))
    }

    constructor(path) {
        Object.assign(this, {path})
    }

    async getSourceFileContent() {
        return CodeBlock.create()
            .append('class BjsNativeObject {').newLine()
            .newLineIndenting()
            .append('constructor(...params) {').newLineIndenting()
            .append('this.constructor.bjsNative.bjsBind(this, ...params)').newLineDeindenting()
            .append('}').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append('module.exports = {BjsNativeObject}')
            .getString()
    }
}

module.exports = {BjsNativeObjectSourceFile}