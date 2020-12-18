const {Generable} = require('./Generable')
const {Type} = require('./types/Type')
const {Parameter} = require('./Parameter')

class Method extends Generable {

    static get schemaName() {
        return 'Method'
    }

    static fromObj(obj) {
        return new Method(obj.name, obj.description, obj.isStatic, Type.fromObj(obj.returnType),
            obj.parameters.map(par => Parameter.fromObj(par)))
    }

    constructor(name, description, isStatic, returnType, parameters) {
        super()
        Object.assign(this, {name, description, isStatic, returnType, parameters})
    }

    get dependingTypes() {
        return [
            this.returnType,
            ...this.returnType.dependingTypes,
            ...this.parameters.flatMap(param => param.dependingTypes)]
    }

    resolveClassType(nativeClassesMap) {
        return new Method(this.name, this.description, this.isStatic,
            this.returnType.resolveClassType(nativeClassesMap),
            this.parameters.map(parameter => parameter.resolveClassType(nativeClassesMap)))
    }
}

module.exports = {Method}