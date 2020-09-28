const parser = require('@babel/parser')
const {ModuleExplorer} = require('../parser/jsExplorer/ModuleExplorer')
const {ClassSchemaCreator} = require('./ClassSchemaCreator')

class ModuleSchemaCreator {

    static async build(guestFile) {
        const moduleSrc = await guestFile.getContent()
        try {
            const parsedNode = parser.parse(moduleSrc, {sourceType: 'module'})
            const classExplorers = new ModuleExplorer(parsedNode, guestFile.relativePath).classExplorers
            return new ModuleSchemaCreator(guestFile, classExplorers)
        } catch (error) {
            error.message = `parsing the file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    constructor(guestFile, classExplorers) {
        Object.assign(this, {guestFile, classExplorers})
    }

    get exporting() {
        return this.classExplorers.length > 0
    }

    get classSchemaCreator() {
        if (!this._classSchemaCreator) {
            if (this.classExplorers.length > 1) {
                throw new Error(`cannot export more than one class from the module "${this.guestFile.relativePath}"`)
            }
            this._classSchemaCreator = new ClassSchemaCreator(this.classExplorers[0])
        }
        return this._classSchemaCreator
    }

    get name() {
        return this.classSchemaCreator.name
    }

    get path() {
        return this.guestFile.relativePath
    }

    getSchema(moduleCreators) {
        return this.classSchemaCreator.getSchema(moduleCreators)
    }
}

module.exports = {ModuleSchemaCreator}