const {Method} = require('../schema/Method')
const {Constructor} = require('../schema/Constructor')
const {Property} = require('../schema/Property')
const {LambdaType} = require('../schema/types/LambdaType')

class MethodSchemaCreator {

    constructor(methodExplorers) {
        Object.assign(this, {methodExplorers})
    }

    get name() {
        return this.methodExplorers[0].name
    }

    get description() {
        return this.methodExplorers.find(accessor => accessor.description !== undefined) || ''
    }

    get kinds() {
        if (!this._kinds) {
            const kinds = new Set(this.methodExplorers.flatMap(accessor => accessor.kinds))

            if (kinds.has('constructor') && (kinds.has('method') || kinds.has('get') || kinds.has('set')))
                throw new Error(`"constructor" cannot be used as a name in a method/getter/setter annotation`)

            if (kinds.has('method') && (kinds.has('get') || kinds.has('set')))
                throw new Error(`"${this.name}" cannot be at the same time a method name and getter/setter name`)

            this._kinds = kinds
        }
        return this._kinds
    }

    get static() {
        if (!this._static) {
            const statics = new Set(this.methodExplorers.flatMap(accessor => accessor.static))

            if (statics.has(true) && statics.has(false))
                throw new Error(`"${this.name}" cannot be static and non-static in the same class`)

            this._static = this.methodExplorers[0].static
        }
        return this._static
    }

    get type() {
        if (!this._type) {
            const types = this.methodExplorers.filter(accessor => accessor.type !== undefined)
            if (types.some(type => !type.isEqualTo(types[0])))
                throw new Error(`getter and setter "${this.name}" must have the same type`)
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

    getSchema(classSchemaCreators) {

        if (this.kinds.has('constructor')) {
            return new Constructor(this.description, this.methodSignature.parameters)

        } else if (this.kinds.has('method')) {
            return new Method(this.name, this.description, this.static, undefined,
                this.methodSignature.returnType, this.methodSignature.parameters)

        } else if (this.kinds[0] === 'get' || this.kinds[0] === 'set') {
            return new Property(this.name, this.description, this.static, undefined, this.type, this.kinds)
        }
    }
}

module.exports = {MethodSchemaCreator}