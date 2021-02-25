const {Method} = require('../schema/Method')
const {Constructor} = require('../schema/Constructor')
const {Property} = require('../schema/Property')
const {LambdaType} = require('../schema/types/LambdaType')

class MethodSchemaCreator {

    constructor(methodExplorers, superclassInfo) {
        Object.assign(this, {methodExplorers, superclassInfo})
    }

    get name() {
        return this.methodExplorers[0].name
    }

    get description() {
        const methodExplorerWithDescription = this.methodExplorers.find(explorer => explorer.description)
        return methodExplorerWithDescription ? methodExplorerWithDescription.description : ''
    }

    get kinds() {
        if (!this._kinds) {
            const kinds = new Set(this.methodExplorers.flatMap(explorer => explorer.kinds))

            if (this.name === 'constructor' && (kinds.has('method') || kinds.has('get') || kinds.has('set'))) {
                throw new Error('"constructor" cannot be used as a name in a method/getter/setter annotation')
            }
            if (kinds.has('method') && (kinds.has('get') || kinds.has('set'))) {
                throw new Error(`"${this.name}" cannot be at the same time a method name and getter/setter name`)
            }
            this._kinds = kinds
        }
        return this._kinds
    }

    get isStatic() {
        if (!this._static) {
            const statics = new Set(this.methodExplorers.flatMap(explorer => explorer.isStatic))

            if (statics.has(true) && statics.has(false)) {
                throw new Error(`"${this.name}" cannot be static and non-static in the same class`)
            }
            this._static = this.methodExplorers[0].isStatic
        }
        return this._static
    }

    get type() {
        if (!this._type) {
            const types = this.methodExplorers.map(explorer => explorer.type)
            if (types.some(type => !type.isEqualTo(types[0]))) {
                throw new Error(`"${this.name}" is annotated multiple times with different types`)
            }
            this._type = types[0]
        }
        return this._type
    }

    get methodSignature() {
        if (!this._methodSignature) {
            if (!(this.type instanceof LambdaType)) {
                throw new Error(`method "${this.name}" annotation has not a lambda type definition`)
            }
            this._methodSignature = this.type
        }
        return this._methodSignature
    }

    get constructorSchema() {
        return new Constructor(this.description, this.methodSignature.parameters)
    }

    get methodSchema() {
        if (this.superclassInfo.methodNames.has(this.name)) {
            throw new Error(`method "${this.name}" was already exported in superclass`)
        }

        return new Method(this.name, this.description, this.isStatic, this.methodSignature.returnType,
            this.methodSignature.parameters)
    }

    get propertySchema() {
        if (this.superclassInfo.propertyNames.has(this.name)) {
            throw new Error(`property "${this.name}" was already exported in superclass`)
        }

        return new Property(this.name, this.description, this.isStatic, this.type, [...this.kinds])
    }

    get schema() {
        if (this.kinds.has('constructor')) {
            return this.constructorSchema
        } else if (this.kinds.has('method')) {
            return this.methodSchema
        } else if (this.kinds.has('get') || this.kinds.has('set')) {
            return this.propertySchema
        }
        return undefined
    }
}

module.exports = {MethodSchemaCreator}
