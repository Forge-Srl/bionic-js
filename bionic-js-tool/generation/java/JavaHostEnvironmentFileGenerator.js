const {CodeBlock} = require('../code/CodeBlock')
const {JavaUtils} = require('./JavaUtils')

class JavaHostEnvironmentFileGenerator {

    constructor(bundleName, nativeFiles, projectName, javaPackage) {
        Object.assign(this, {bundleName, nativeFiles, projectName, javaPackage})
    }

    getSource() {
        return CodeBlock.create()
            .append(`package ${this.javaPackage};`).newLine()
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
                const fullPackage = JavaUtils.fullPackage(this.javaPackage, nativeSourceFile.schema.modulePath)
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