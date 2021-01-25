const bjsIndexSourceFileName = 'BjsIndex'
const path = require('path')
const {CodeBlock} = require('../generation/code/CodeBlock')
const {posixPath} = require('./posixPath')

class BjsIndexSourceFile {

    static build(annotatedFiles, bundleName, guestDirPath) {
        return new BjsIndexSourceFile(
            posixPath(path.resolve(guestDirPath, `${bundleName}${bjsIndexSourceFileName}.js`)), annotatedFiles)
    }

    constructor(path, annotatedFiles) {
        Object.assign(this, {path, annotatedFiles})
    }

    async getSourceFileContent() {
        return CodeBlock.create()
            .append('bjsSetModuleLoader(moduleName => {').newLineIndenting()
            .append('switch (moduleName) {').newLineIndenting()
            .append(this.annotatedFiles
                .filter(annotatedFile => annotatedFile.exportsClass)
                .map((annotatedFile, index, array) => CodeBlock.create()
                    .append(`case '${annotatedFile.guestFile.name}': return require('./${annotatedFile.guestFile.relativePath}')`)
                    .newLine(index === array.length - 1 ? -1 : 0)),
            )
            .append('}').newLineDeindenting()
            .append('})')
            .getString()
    }
}

module.exports = {BjsIndexSourceFile}