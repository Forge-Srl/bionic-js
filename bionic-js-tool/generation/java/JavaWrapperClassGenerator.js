const {ClassGenerator} = require('../ClassGenerator')
const {Constructor} = require('../../schema/Constructor')
const {CodeBlock} = require('../code/CodeBlock')
const {ClassType} = require('../../schema/types/ClassType')

class JavaWrapperClassGenerator extends ClassGenerator {

    static pathToPackage(fullClassPath) {
        const pathParts = fullClassPath.split('/')
        pathParts.pop()
        return pathParts.join('.')
    }

    constructor(schema, hostClassGenerator, projectName, basePackage, allFiles) {
        super(schema)
        Object.assign(this, {hostClassGenerator, projectName, basePackage, allFiles})
    }

    get constructors() {
        return []
    }

    get classPartsGenerators() {
        if (!this._classPartsGenerators) {
            this._classPartsGenerators = this.getClassParts().map(classPart => classPart.generator.forWrapping(this.schema).java)
        }
        return this._classPartsGenerators
    }

    get hasClassParts() {
        if (!this._hasClassParts) {
            this._hasClassParts = !!this.getClassParts().length
        }
        return this._hasClassParts
    }

    get filesPaths() {
        if (!this._filesPaths) {
            this._filesPaths = new Map(this.allFiles.map(file => [file.name, file.relativePath]))
        }
        return this._filesPaths
    }

    getFullPackage(path) {
        const subPackage = this.constructor.pathToPackage(path)
        return subPackage ? `${this.basePackage}.${subPackage}` : this.basePackage
    }

    getFullDependencyPackage(classType) {
        if (classType.typeName === 'NativeRef') {
            throw new Error('NativeRef are evil!')
        }

        const relativePath = this.filesPaths.get(classType.className)
        if (relativePath) {
            const className = classType.typeName === 'NativeClass'
                ? `${classType.className}BjsExport`
                : classType.className

            return `${this.getFullPackage(relativePath)}.${className}`
        }

        throw new Error(`Unresolved import ${classType.toString()} (${classType.typeName})`)
    }

    getTypesImport() {
        const classImports = this.schema.dependingTypes
            .filter(type => type instanceof ClassType)
            .map(type => {
                if (type.className === this.schema.name)
                    return null

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
            ? `import ${this.getFullPackage(this.schema.superclass.modulePath)}.${this.schema.superclass.name}BjsExport;`
            : 'import bionic.js.BjsExport;'
        const superclassName = this.schema.superclass ? `${this.schema.superclass.name}BjsExport` : 'BjsExport'
        return CodeBlock.create()
            .append(`package ${this.getFullPackage(this.schema.modulePath)};`).newLine()
            .newLine()
            .append('import bionic.js.Bjs;').newLine()
            .append('import bionic.js.BjsNativeExports;').newLine()
            .append('import bionic.js.BjsNativeWrapper;').newLine()
            .append('import bionic.js.BjsNativeWrapperTypeInfo;').newLine()
            .append('import bionic.js.BjsTypeInfo;').newLine()
            .append('import jjbridge.api.value.strategy.FunctionCallback;').newLine()
            .append(this.getTypesImport())
            .append(baseImport).newLine()
            .newLine()
            .append(`public interface ${this.schema.name}BjsExport extends ${superclassName} {`).newLineIndenting()
            .newLine()
            .append('Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();').newLine()
            .newLine()
    }

    getExportBodyCode() {
        const codeBlock = CodeBlock.create()
            .append(this.classPartsGenerators
                .map(classPartGenerator => classPartGenerator.getInterfaceDeclaration())
                .map(declaration => CodeBlock.create()
                    .append(declaration).newLineConditional(declaration)))

        if (codeBlock.getString() === '') {
            return null
        }
        return codeBlock.newLine()
    }

    getWrapperHeaderCode() {
        const superclass = this.schema.superclass ? `${this.schema.superclass.name}BjsExport.Wrapper` : 'BjsNativeWrapper'
        return CodeBlock.create()
            .append(`@BjsTypeInfo.BjsLocation(project = "${this.projectName}", module = "${this.schema.name}")`).newLine()
            .append(`class Wrapper<T extends ${this.schema.name}BjsExport> extends ${superclass}<T> {`).newLineIndenting()
            .newLine()
            .append('private static Wrapper<?> wrapper;').newLine()
            .append('private static Wrapper<?> getInstance() {').newLineIndenting()
            .append('if (wrapper == null) {').newLineIndenting()
            .append(`wrapper = new Wrapper<>(getClass(${this.schema.name}BjsExport.class, "${this.schema.name}"));`).newLineDeindenting()
            .append('}').newLine()
            .append('return wrapper;').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append('protected Wrapper(Class<T> realImplementation) {').newLineIndenting()
            .append('super(realImplementation);').newLineDeindenting()
            .append('}').newLine()
            .newLine()
            .append(this.getExportFunctionsCode()).newLine()
            .newLine()
            .append(this.getExportConstructorCode())
    }

    getWrapperBodyCode() {
        return CodeBlock.create()
            .append(this.classPartsGenerators.map(classPartGenerator =>
                CodeBlock.create().newLine()
                    .newLine()
                    .append(classPartGenerator.getCode()),
            ))
    }

    getWrapperFooterCode() {
        return CodeBlock.create().newLineDeindenting().append('}')
    }

    getExportFunctionsCode() {
        let baseExports = this.schema.superclass
            ? `${this.schema.superclass.name}BjsExport.Wrapper.bjsExportFunctions(nativeExports)`
            : 'nativeExports'

        return CodeBlock.create()
            .append('@BjsNativeWrapperTypeInfo.Exporter').newLine()
            .append('public static BjsNativeExports bjsExportFunctions(BjsNativeExports nativeExports) {').newLineIndenting()
            .append(this.hasClassParts ? 'Wrapper<?> singleton = getInstance();' : null).newLineConditional(this.hasClassParts)
            .append(`return ${baseExports}`)
            .__.newLineConditional(this.hasClassParts, 1)
            .append(this.classPartsGenerators.map((generator, index, array) => {
                return generator.wrapperExportLines.newLineConditional(index < array.length - 1)
            })).append(';').newLine(this.hasClassParts ? -2 : -1)
            .append('}')
    }

    getExportConstructorCode(schema = this.schema) {
        if (!schema.constructors.length) {
            if (schema.superclass) {
                return this.getExportConstructorCode(schema.superclass)
            }
            return new Constructor('Default constructor', []).generator.forWrapping(this.schema, false).java.getCode()
        }
        return schema.constructors[0].generator.forWrapping(this.schema, true).java.getCode()
    }

    getBodyCode() {
        return CodeBlock.create()
            .append(this.getExportBodyCode())
            .append(this.getWrapperHeaderCode())
            .append(this.getWrapperBodyCode())
            .append(this.getWrapperFooterCode())
    }

    getFooterCode() {
        const footerCode = CodeBlock.create().newLineDeindenting().append('}')

        if (this.hostClassGenerator) {
            footerCode.newLine()
                .newLine()
                .append(`/* ${this.schema.name} class scaffold:`).newLine()
                .newLine()
                .append(this.hostClassGenerator.getScaffold()).newLine()
                .newLine()
                .append('*/')
        }
        return footerCode
    }
}

module.exports = {JavaWrapperClassGenerator}