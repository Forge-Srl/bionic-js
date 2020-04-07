const {CodeBlock} = require('../code/CodeBlock')

class SwiftHostEnvironmentFileGenerator {

    constructor(packageName, nativePackageFiles) {
        Object.assign(this, {packageName, nativePackageFiles})
    }

    getSource() {
        return CodeBlock.create()
            .append('import Bjs').newLine()
            .newLine()
            .append('class BjsEnvironment {').newLineIndenting()
            .newLine()
            .append('static func initialize() {').newLineIndenting()
            .append(`Bjs.jsBundleName = "${this.packageName}"`)
            .append(this.nativePackageFiles.map(nativePackageFile =>
                CodeBlock.create().newLine().append(`Bjs.get.addNativeWrapper(${nativePackageFile.schema.name}Wrapper.self)`)))
            .newLineDeindenting()
            .append('}')
            .newLineDeindenting()
            .append('}')
            .getString()
    }
}

module.exports = {SwiftHostEnvironmentFileGenerator}