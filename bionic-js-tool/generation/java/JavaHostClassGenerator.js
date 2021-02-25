const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {ClassType} = require('../../schema/types/ClassType')
const {JavaUtils} = require('./JavaUtils')

class JavaHostClassGenerator extends ClassGenerator {

    constructor(schema, projectName, basePackage, allFiles) {
        super(schema)
        Object.assign(this, {projectName, basePackage, allFiles})
    }

    get filesPaths() {
        if (!this._filesPaths) {
            this._filesPaths = new Map(this.allFiles.map(file => [file.name, file.relativePath]))
        }
        return this._filesPaths
    }

    getFullDependencyPackage(classType) {
        const relativePath = this.filesPaths.get(classType.className)
        if (relativePath) {
            const className = classType.typeName === 'NativeClass'
                ? `${classType.className}BjsExport`
                : classType.className

            return `${JavaUtils.fullPackage(this.basePackage, relativePath)}.${className}`
        }

        throw new Error(`Unresolved import ${classType.toString()} (${classType.typeName})`)
    }

    getTypesImport() {
        const classImports = this.schema.dependingTypes
            .filter(type => type instanceof ClassType)
            .map(type => {
                if (type.className === this.schema.name) {
                    return null
                }
                const fullPackage = this.getFullDependencyPackage(type)
                return fullPackage ? `import ${fullPackage};` : null
            })

        const uniqueImports = [...new Set(classImports)].filter(notNull => notNull)
        uniqueImports.sort((a, b) => a.localeCompare(b, 'en', {ignorePunctuation: true}))

        const block = CodeBlock.create()
        uniqueImports.forEach(type => block.append(type).newLine())
        return block
    }

    getHeaderCode() {
        const baseImport = this.schema.superclass
            ? `import ${JavaUtils.fullPackage(this.basePackage, this.schema.superclass.modulePath)}.${this.schema.superclass.name};`
            : 'import bionic.js.BjsObject;'
        const superclassName = this.schema.superclass ? this.schema.superclass.name : 'BjsObject'

        return CodeBlock.create()
            .append(`package ${JavaUtils.fullPackage(this.basePackage, this.schema.modulePath)};`).newLine()
            .newLine()
            .append('import jjbridge.api.runtime.JSReference;').newLine()
            .append('import jjbridge.api.value.strategy.FunctionCallback;').newLine()
            .append('import bionic.js.Bjs;').newLine()
            .append('import bionic.js.BjsTypeInfo;').newLine()
            .append('import bionic.js.BjsObjectTypeInfo;').newLine()
            .append('import bionic.js.Lambda;').newLine()
            .append('import java.util.Date;').newLine()
            .append(this.getTypesImport())
            .append(baseImport).newLine()
            .newLine()
            .append(`@BjsTypeInfo.BjsLocation(project = "${this.projectName}", module = "${this.schema.name}")`).newLine()
            .append(`public class ${this.schema.name} extends ${superclassName} {`).newLineIndenting()
            .newLine()
            .append(`protected <T extends ${superclassName}> ${this.schema.name}(Class<T> type, JSReference jsObject) {`).newLineIndenting()
            .append('super(type, jsObject);').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append(`protected <T extends ${superclassName}> ${this.schema.name}(Class<T> type, JSReference[] arguments) {`).newLineIndenting()
            .append('super(type, arguments);').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append(`public ${this.schema.name}(JSReference jsObject) {`).newLineIndenting()
            .append(`this(${this.schema.name}.class, jsObject);`).newLineDeindenting()
            .append('}').newLine()
            .newLine()
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getClassParts().map(classPart =>
                classPart.generator.forHosting(this.schema, this.basePackage).java.getCode().newLine()
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
        const superClassExtension = this.schema.superclass ? `extends ${this.schema.superclass.name} ` : ''

        const scaffoldCode = CodeBlock.create()
            .append(`import ${JavaUtils.fullPackage(this.basePackage, this.schema.modulePath)}.${this.schema.name}BjsExport;`).newLine()
            .newLine()
            .append(`public class ${this.schema.name} ${superClassExtension}implements ${this.schema.name}BjsExport {`).newLineIndenting()

        const classParts = this.getClassParts()
        if (classParts.length) {
            scaffoldCode.newLine()
        }

        return scaffoldCode.append(classParts.map((classPart, index) => {
            const classPartCode = classPart.generator.forHosting(this.schema, this.basePackage).java.getScaffold()
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