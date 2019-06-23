const {CodeGenerator} = require('../CodeGenerator')
const {CodeBlock} = require('../code/CodeBlock')
const {CodeFile} = require('../CodeFile')

class SwiftClassGenerator extends CodeGenerator {

    get staticProperties() {
        return this.schema.properties.filter(property => property.isStatic)
    }

    get staticMethods() {
        return this.schema.methods.filter(method => method.isStatic)
    }

    get constructors() {
        return this.schema.constructors
    }

    get instanceProperties() {
        return this.schema.properties.filter(property => !property.isStatic)
    }

    get instanceMethods() {
        return this.schema.methods.filter(method => !method.isStatic)
    }

    getClassParts() {
        return [
            ...this.staticProperties,
            ...this.staticMethods,
            ...this.constructors,
            ...this.instanceProperties,
            ...this.instanceMethods,
        ]
    }

    getFiles() {
        const code = CodeBlock.create()
            .append(this.getHeaderCode())
            .append(this.getBodyCode())
            .append(this.getFooterCode())

        return [new CodeFile(this.schema.name + '.swift', code.getString())]
    }
}

module.exports = {SwiftClassGenerator}