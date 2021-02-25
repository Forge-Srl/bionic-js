const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')

class JavascriptWrapperPropertyGenerator extends CodeGenerator {

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

    get staticModifier() {
        return this.schema.isStatic ? 'static ' : ''
    }

    getWrapperMethodName(propertyModifier) {
        const staticMod = this.schema.isStatic ? 'Static' : ''
        return `bjs${staticMod}${propertyModifier}_${this.schema.name}`
    }

    getGetterCode() {
        if (!this.hasGetter) {
            return null
        }

        const thisReference = !this.schema.isStatic ? 'this' : ''

        return CodeBlock.create()
            .append(`${this.staticModifier}get ${this.schema.name}() {`).newLineIndenting()
            .append(`return bjsNative.${this.getWrapperMethodName('Get')}(${thisReference})`).newLineDeindenting()
            .append('}')
    }

    getSetterCode() {
        if (!this.hasSetter) {
            return null
        }

        const thisReference = !this.schema.isStatic ? 'this, ' : ''

        return CodeBlock.create()
            .append(`${this.staticModifier}set ${this.schema.name}(value) {`).newLineIndenting()
            .append(`bjsNative.${this.getWrapperMethodName('Set')}(${thisReference}value)`).newLineDeindenting()
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

module.exports = {JavascriptWrapperPropertyGenerator}