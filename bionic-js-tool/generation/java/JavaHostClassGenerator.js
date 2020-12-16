const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class JavaHostClassGenerator extends ClassGenerator {

    static pathToPackage(fullClassPath) {
        const pathParts = fullClassPath.split('/')
        pathParts.pop()
        return pathParts.join('.')
    }

    constructor(schema, projectName, basePackage) {
        super(schema)
        Object.assign(this, {projectName, basePackage})
    }

    getHeaderCode() {
        const packageName = `${this.basePackage}.${this.constructor.pathToPackage(this.schema.modulePath)}`
        const superclassName = this.schema.superclass
            ? `${this.constructor.pathToPackage(this.schema.superclass.modulePath)}.${this.schema.superclass.name}`
            : 'BjsObject'
        const baseImport = superclassName === 'BjsObject' ? 'import bionic.js.BjsObject;' : null

        return CodeBlock.create()
            .append(`package ${packageName};`).newLine()
            .newLine()
            .append('import jjbridge.api.runtime.JSReference;').newLine()
            .append('import bionic.js.Bjs;').newLine()
            .append('import bionic.js.BjsTypeInfo;').newLine()
            .append('import bionic.js.BjsObjectTypeInfo;').newLine()
            .append(baseImport).newLineConditional(baseImport)
            .newLine()
            .append(`@BjsTypeInfo.BjsLocation(project = "${this.projectName}", module = "${this.schema.name}")`).newLine()
            .append(`public class ${this.schema.name} extends ${superclassName} {`).newLineIndenting()
            .newLine()
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getClassParts().map(classPart =>
                classPart.generator.forHosting(this.schema).java.getCode().newLine()
                    .newLine()))
    }

    getFooterCode() {
        return CodeBlock.create()
            .append(`private static final JSReference bjsClass = BjsObjectTypeInfo.get(${this.schema.name}.class).bjsClass();`).newLine()
            .append(`public static final Bjs bjs = BjsObjectTypeInfo.get(${this.schema.name}.class).bjsLocator.get();`).newLine()
            .append(`public static final Bjs.JSReferenceConverter<${this.schema.name}> bjsFactory = ${this.schema.name}::new;`)
            .__.newLineDeindenting()
            .append('}')
    }

    getScaffold() {
        const packageName = `${this.basePackage}.${this.constructor.pathToPackage(this.schema.modulePath)}`
        const superClassExtension = this.schema.superclass ? `extends ${this.schema.superclass.name} ` : ''

        const scaffoldCode = CodeBlock.create()
            .append(`import ${packageName}.${this.schema.name}BjsExport;`).newLine()
            .newLine()
            .append(`public class ${this.schema.name} ${superClassExtension}implements ${this.schema.name}BjsExport {`).newLineIndenting()

        const classParts = this.getClassParts()
        if (classParts.length)
            scaffoldCode.newLine()

        return scaffoldCode.append(classParts.map((classPart, index) => {
            const classPartCode = classPart.generator.forHosting(this.schema).java.getScaffold()
            if (index < classParts.length - 1) {
                classPartCode.newLine().newLine()
            }
            return classPartCode
        }))
            .newLineDeindenting()
            .append('}')
    }
}

module.exports = {JavaHostClassGenerator}