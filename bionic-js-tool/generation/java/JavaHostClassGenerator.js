const {ClassGenerator} = require('../ClassGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {ClassType} = require('../../schema/types/ClassType')

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

    getFullPackage() {
        const subPackage = this.constructor.pathToPackage(this.schema.modulePath)
        return subPackage ? `${this.basePackage}.${subPackage}` : this.basePackage
    }

    getFullSuperPackage() {
        const subPackage = this.constructor.pathToPackage(this.schema.superclass.modulePath)
        return subPackage ? `${this.basePackage}.${subPackage}` : this.basePackage
    }

    getFullDependencyPackage(classType) {
        // TODO: resolve full package correctly from class type
        if (classType.typeName === 'NativeClass')
            return `${this.basePackage}.NATIVE.TODO.${classType.className}`

        if (classType.typeName === 'JsClass')
            return `${this.basePackage}.TODO.${classType.className}`

        if (classType.typeName === 'NativeRef')
            return `${this.basePackage}.TODO.${classType.className}BjsExport`

        return null
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
            ? `import ${this.getFullSuperPackage()}.${this.schema.superclass.name};`
            : 'import bionic.js.BjsObject;'
        const superclassName = this.schema.superclass ? this.schema.superclass.name : 'BjsObject'

        return CodeBlock.create()
            .append(`package ${this.getFullPackage()};`).newLine()
            .newLine()
            .append('import jjbridge.api.runtime.JSReference;').newLine()
            .append('import bionic.js.Bjs;').newLine()
            .append('import bionic.js.BjsTypeInfo;').newLine()
            .append('import bionic.js.BjsObjectTypeInfo;').newLine()
            .append(this.getTypesImport())
            .append(baseImport).newLine()
            .newLine()
            .append(`@BjsTypeInfo.BjsLocation(project = "${this.projectName}", module = "${this.schema.name}")`).newLine()
            .append(`public class ${this.schema.name} extends ${superclassName} {`).newLineIndenting()
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
            .append(`import ${this.getFullPackage()}.${this.schema.name}BjsExport;`).newLine()
            .newLine()
            .append(`public class ${this.schema.name} ${superClassExtension}implements ${this.schema.name}BjsExport {`).newLineIndenting()

        const classParts = this.getClassParts()
        if (classParts.length)
            scaffoldCode.newLine()

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