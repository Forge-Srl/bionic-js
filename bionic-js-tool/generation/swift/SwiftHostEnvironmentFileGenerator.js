const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostEnvironmentFileGenerator {

    constructor(bundleName, nativeFiles, projectName) {
        Object.assign(this, {bundleName, nativeFiles, projectName})
    }

    getSource() {
        return CodeBlock.create()
            .append('import Foundation').newLine()
            .append('import Bjs').newLine()
            .newLine()
            .append(`@objc(Bjs${this.projectName})`).newLine()
            .append(`class Bjs${this.projectName} : BjsProject {`).newLineIndenting()
            .newLine()
            .append('override class func initialize(_ bjs: Bjs) {').newLineIndenting()
            .append(`bjs.loadBundle(Bjs${this.projectName}.self, "${this.bundleName}")`)
            .append(this.nativeFiles.map(nativeSourceFile =>
                CodeBlock.create().newLine().append(`bjs.addNativeWrapper(${nativeSourceFile.schema.name}BjsWrapper.self)`)))
            .newLineDeindenting()
            .append('}')
            .newLineDeindenting()
            .append('}')
            .getString()
    }
}

module.exports = {SwiftHostEnvironmentFileGenerator}