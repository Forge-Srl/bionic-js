const {Method} = require('../schema/Method')
const {Property} = require('../schema/Property')
const {LambdaType} = require('../schema/types/LambdaType')

class MethodSchemaCreator {

    constructor(methodExplorers, methodParsers) {
        Object.assign(this, {methodExplorers, methodParsers})
    }

    get accessors() {
        if (!this._accessors) {
            this._accessors = [...this.methodExplorers, ...this.methodParsers]
        }
        return this._accessors
    }

    get name() {
        return this.accessors[0].name
    }

    get description() {
        return this.accessors.find(accessor => accessor.description !== undefined) || ''
    }

    get kinds() {
        if (!this._kinds) {
            const kindsSet = new Set(this.accessors.flatMap(accessor => accessor.kinds))

            if (kindsSet.has('constructor') && (kindsSet.has('method') || kindsSet.has('get') || kindsSet.has('set')))
                throw new Error(`"constructor" cannot be annotated as a method/getter/setter name`)

            if (kindsSet.has('method') && (kindsSet.has('get') || kindsSet.has('set')))
                throw new Error(`"${this.name}" cannot be at the same time a method name and getter/setter name`)

            this._kinds = [...kindsSet]
        }
        return this._kinds
    }

    get static() {
        if (!this._static) {
            const statics = new Set(this.accessors.flatMap(accessor => accessor.static))

            if (statics.has(true) && statics.has(false))
                throw new Error(`"${this.name}" cannot be static and non-static in the same class`)

            this._static = this.accessors[0].static
        }
        return this._static
    }

    get type() {
        if (!this._type) {
            const types = this.accessors.filter(accessor => accessor.type !== undefined)
            if (types.some(type => !type.isEqualTo(types[0])))
                throw new Error(`getter and setter "${this.name}" must have the same type`)
            this._type = types[0]
        }
        return this._type
    }

    get methodSignature() {
        if (!this._methodSignature) {
            if (!(this.type instanceof LambdaType)) {
                throw new Error(`Method named "${this.name}" has an annotations without a lambda type definition`)
            }
            this._methodSignature = this.type
        }
        return this._methodSignature
    }

    get methodReturnType() {
        return this.methodSignature.returnType
    }

    get methodParameters() {
        const parameters = this.methodSignature.parameters
        const parametersNamesFromJs = this.methodExplorers[0].parameterExplorers.map(explorer => explorer.name)

        if (parameters.length !== parametersNamesFromJs.length ||
            parameters.some(parameter => !parametersNamesFromJs.includes(parameter))) {

            throw new Error(`Parameter names of method "${this.name}" mismatch from those declared in the type annotation`)
        }
        return parameters
    }

    async getSchema(parsingSession) {
        if (this.kinds[0] === 'method') {
            return new Method(this.name, this.description, this.static, undefined,
                this.methodSignature.returnType, this.methodSignature.parameters)

        } else if (this.kinds[0] === 'get' || this.kinds[0] === 'set') {
            return new Property(this.name, this.description, this.static, undefined, this.type, this.kinds)
        }
    }
}
}

module.exports = {MethodSchemaCreator}