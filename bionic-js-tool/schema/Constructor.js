const SchemaWithGenerators = require('./SchemaWithGenerators')
const Parameter = require('./Parameter')

class Constructor extends SchemaWithGenerators {

    constructor(description, parameters) {
        super()
        Object.assign(this, {description, parameters})
    }

    getHostGeneratorClass(directory, classPrefix) {
        return require(`../generation/host/${directory}/${classPrefix}ConstructorGenerator`)
    }

    static fromObj(obj) {
        return new Constructor(obj.description, obj.parameters.map(par => Parameter.fromObj(par)))
    }
}

module.exports = Constructor