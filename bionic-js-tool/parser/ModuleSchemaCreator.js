const parser = require('@babel/parser')
const {ModuleExplorer} = require('../parser/jsExplorer/ModuleExplorer')
const {ClassSchemaCreator} = require('./ClassSchemaCreator')

class ModuleSchemaCreator {

    constructor(guestFile) {
        Object.assign(this, {guestFile})
    }

    async getModuleExplorer() {
        if (!this._moduleExplorer) {
            const moduleSrc = await this.guestFile.getContent()
            try {
                const parsedNode = parser.parse(moduleSrc, {sourceType: 'module'})
                this._moduleExplorer = new ModuleExplorer(parsedNode, this.guestFile.relativePath)
            } catch (error) {
                throw new Error(`parsing error in file "${this.guestFile.relativePath}": ${error}`)
            }
        }
        return this._moduleExplorer
    }

    async getClassSchemaCreators() {
        const classExplorers = (await this.getModuleExplorer()).classExplorers
        if (classExplorers.length > 1) {
            throw new Error(`cannot export more than one class from the module "${this.guestFile.relativePath}"`)
        }
        return classExplorers.map(classExplorer => new ClassSchemaCreator(classExplorer))
    }
}

module.exports = {ModuleSchemaCreator}