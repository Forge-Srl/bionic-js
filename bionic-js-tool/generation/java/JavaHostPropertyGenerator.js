const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {JavaGenerationContext} = require('./JavaGenerationContext')
const {IniRet} = require('../code/IniRet')
const {JavaKeywords} = require('./JavaKeywords')

class JavaHostPropertyGenerator extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }

    get typeGenerator() {
        return this.schema.type.generator.java
    }

    get hasGetter() {
        return this.schema.kinds.includes('get')
    }

    get hasSetter() {
        return this.schema.kinds.includes('set')
    }

    getGetterCode(isScaffold) {
        if (!this.hasGetter) {
            return null
        }

        const typeStatement = this.typeGenerator.getTypeStatement()
        const header = CodeBlock.create()
            .append(`public ${this.schema.isStatic ? 'static ' : ''}${typeStatement} ${JavaKeywords.getSafeIdentifier(this.schema.name)}() {`).newLineIndenting()

        if (!isScaffold) {
            const typeGen = this.typeGenerator
            const getterContext = new JavaGenerationContext()
            const jsValueIniRet = IniRet.create()
                .appendRet(this.schema.isStatic ? 'bjs.getProperty(bjsClass, ' : 'bjsGetProperty(')
                .__.appendRet(`"${this.schema.name}")`)

            header.append(typeGen.getNativeReturnCode(typeGen.getNativeIniRet(jsValueIniRet, getterContext, false)))
        }

        return header.newLineDeindenting().append('}')
    }

    getSetterCode(isScaffold) {
        if (!this.hasSetter) {
            return null
        }

        const typeStatement = this.typeGenerator.getTypeStatement()
        const header = CodeBlock.create()
            .append(`public ${this.schema.isStatic ? 'static ' : ''}void ${JavaKeywords.getSafeIdentifier(this.schema.name)}(${typeStatement} value) {`).newLineIndenting()

        if (!isScaffold) {
            const setterContext = new JavaGenerationContext()
            const jsValueIniRet = this.typeGenerator.getJsIniRet(IniRet.create().appendRet('value'), setterContext)

            header
                .append(jsValueIniRet.initializationCode)
                .append(this.schema.isStatic ? 'bjs.setProperty(bjsClass, ' : 'bjsSetProperty(')
                .__.append(`"${this.schema.name}", `).append(jsValueIniRet.returningCode).append(');')
        }

        return header.newLineDeindenting().append('}')
    }

    getCode() {
        const getterCode = this.getGetterCode(false)
        const setterCode = this.getSetterCode(false)

        return CodeBlock.create()
            .append(getterCode).newLineConditional(getterCode && setterCode)
            .append(setterCode)
    }

    getScaffold() {
        const getterCode = this.getGetterCode(true)
        const setterCode = this.getSetterCode(true)

        return CodeBlock.create()
            .append(getterCode).newLineConditional(getterCode && setterCode)
            .append(setterCode)
    }
}

module.exports = {JavaHostPropertyGenerator}