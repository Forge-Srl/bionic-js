const {CodeBlock} = require('../code/CodeBlock')

class JavaHostEnvironmentFileGenerator {

    constructor(bundleName, nativeFiles, projectName, javaPackage) {
        Object.assign(this, {bundleName, nativeFiles, projectName, javaPackage})
    }

    static pathToPackage(fullClassPath) {
        const pathParts = fullClassPath.split('/')
        pathParts.pop()
        return pathParts.join('.')
    }

    getSource() {
        return CodeBlock.create()
            .append(`package ${this.javaPackage}.Bjs${this.bundleName};`).newLine()
            .newLine()
            .append('import bionic.js.Bjs;').newLine()
            .append('import bionic.js.BjsProject;').newLine()
            .append('import bionic.js.BjsProjectTypeInfo;').newLine()
            .newLine()
            .append(`public class Bjs${this.projectName} extends BjsProject {`).newLineIndenting()
            .newLine()
            .append('@BjsProjectTypeInfo.Initializer').newLine()
            .append('public static void initialize(Bjs bjs) {').newLineIndenting()
            .append('initProject();').newLine()
            .append(`bjs.loadBundle(Bjs${this.projectName}.class, "${this.bundleName}");`)
            .append(this.nativeFiles.map(nativeSourceFile => {
                const subPackage = this.constructor.pathToPackage(nativeSourceFile.schema.modulePath)
                const fullPackage = subPackage ? `${this.javaPackage}.${subPackage}` : this.javaPackage
                return CodeBlock.create().newLine()
                    .append(`bjs.addNativeWrapper(${fullPackage}.${nativeSourceFile.schema.name}BjsExport.Wrapper.class);`)
            }))
            .newLineDeindenting()
            .append('}')
            .newLineDeindenting()
            .append('}')
            .getString()
    }
}

module.exports = {JavaHostEnvironmentFileGenerator}