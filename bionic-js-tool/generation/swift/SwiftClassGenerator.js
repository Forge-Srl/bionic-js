const CodeGenerator = require('../CodeGenerator')

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
}

module.exports = SwiftClassGenerator