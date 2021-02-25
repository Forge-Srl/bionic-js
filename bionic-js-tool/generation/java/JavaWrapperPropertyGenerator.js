const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {IniRet} = require('../code/IniRet')

class JavaWrapperPropertyGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get hasGetter() {
        return this.schema.kinds.includes('get')
    }

    get hasSetter() {
        return this.schema.kinds.includes('set')
    }

    get typeGenerator() {
        return this.schema.type.generator.java
    }

    get getterWrapperMethodName() {
        return this.getWrapperMethodName('Get')
    }

    get setterWrapperMethodName() {
        return this.getWrapperMethodName('Set')
    }

    get wrapperExportLines() {
        const exportLines = CodeBlock.create()

        if (this.hasGetter) {
            exportLines
                .append(`.exportFunction("${this.getterWrapperMethodName}", singleton.${this.getterWrapperMethodName}())`)
                .__.newLineConditional(this.hasGetter && this.hasSetter)
        }

        if (this.hasSetter) {
            exportLines.append(`.exportFunction("${this.setterWrapperMethodName}", singleton.${this.setterWrapperMethodName}())`)
        }

        return exportLines
    }

    getNativePropertyGetterIniRet(context) {
        const iniRet = IniRet.create()
        if (this.schema.isStatic) {
            const tempVar = context.getUniqueIdentifier('result')
            const typeStatement = this.typeGenerator.getTypeStatement()
            iniRet
                .editIni(ini => ini
                    .append(`${typeStatement} ${tempVar} = invokeStatic("${this.schema.name}", new Class[]{}, new Object[]{});`).newLine())
                .appendRet(tempVar)
        } else {
            iniRet.editRet(ret =>
                ret.append(`((${this.classSchema.name}BjsExport) bjs.getWrapped(jsReferences[0])).${this.schema.name}()`))
        }

        return iniRet
    }

    getNativePropertySetterIniRet(nativeValueIniRet) {
        const iniRet = IniRet.create()
            .appendIni(nativeValueIniRet.initializationCode)

        if (this.schema.isStatic) {
            const typeClass = this.typeGenerator.getTypeClass()
            iniRet
                .editRet(ret => ret
                    .append(`invokeStatic("${this.schema.name}", new Class[]{${typeClass}}, new Object[]{`)
                    .__.append(nativeValueIniRet.returningCode).append('});'))
        } else {
            iniRet
                .editRet(ret => ret
                    .append(`((${this.classSchema.name}BjsExport) bjs.getWrapped(jsReferences[0])).${this.schema.name}(`)
                    .__.append(nativeValueIniRet.returningCode).append(');'))
        }

        return iniRet.editRet(ret => ret.newLine().append('return bjs.jsUndefined();'))
    }

    getInterfaceDeclaration() {
        if (this.schema.isStatic) {
            return null
        }

        const typeStatement = this.typeGenerator.getTypeStatement()
        const propertyCode = CodeBlock.create()
        if (this.hasGetter) {
            propertyCode.append(`${typeStatement} ${this.schema.name}();`).newLineConditional(this.hasSetter)
        }

        if (this.hasSetter){
            propertyCode.append(`void ${this.schema.name}(${typeStatement} value);`)
        }

        return propertyCode
    }

    getWrapperMethodName(propertyModifier) {
        const staticMod = this.schema.isStatic ? 'Static' : ''
        return `bjs${staticMod}${propertyModifier}_${this.schema.name}`
    }

    getGetterCode() {
        if (!this.hasGetter) {
            return null
        }

        const typeGen = this.typeGenerator
        const getterContext = new JavaGenerationContext()

        return CodeBlock.create()
            .append(`protected FunctionCallback<?> ${this.getterWrapperMethodName}() {`).newLineIndenting()
            .append('return jsReferences -> {').newLineIndenting()
            .append(typeGen.getNativeReturnCode(typeGen.getJsIniRet(this.getNativePropertyGetterIniRet(getterContext),
                getterContext), false))
            .__.newLineDeindenting()
            .append('};').newLineDeindenting()
            .append('}')
    }

    getSetterCode() {
        if (!this.hasSetter) {
            return null
        }

        const setterContext = new JavaGenerationContext()
        const jsReferenceVar = `jsReferences[${this.schema.isStatic ? 0 : 1}]`
        const nativeValueIniRet = this.typeGenerator.getNativeIniRet(IniRet.create().appendRet(jsReferenceVar),
            setterContext)
        const nativePropertyIniRet = this.getNativePropertySetterIniRet(nativeValueIniRet)
        return CodeBlock.create()
            .append(`protected FunctionCallback<?> ${this.setterWrapperMethodName}() {`).newLineIndenting()
            .append('return jsReferences -> {').newLineIndenting()
            .append(nativePropertyIniRet.initializationCode)
            .append(nativePropertyIniRet.returningCode).newLineDeindenting()
            .append('};').newLineDeindenting()
            .append('}')
    }

    getCode() {
        const propertyCode = CodeBlock.create()
            .append(this.getGetterCode())

        if (this.hasGetter && this.hasSetter) {
            propertyCode.newLine().newLine()
        }

        return propertyCode.append(this.getSetterCode())
    }
}

module.exports = {JavaWrapperPropertyGenerator}