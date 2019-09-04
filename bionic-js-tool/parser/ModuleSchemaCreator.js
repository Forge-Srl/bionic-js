const parser = require('@babel/parser')
const {ModuleExplorer} = require('../parser/jsExplorer/ModuleExplorer')
const {ClassSchemaCreator} = require('./ClassSchemaCreator')

class ModuleSchemaCreator {

    constructor(guestFile) {
        Object.assign(this, {guestFile})
    }

    async getModuleExplorer() {
        const moduleSrc = await this.guestFile.getContent()
        const parsedNode = parser.parse(moduleSrc, {sourceType: 'module'})
        return new ModuleExplorer(parsedNode, this.guestFile.relativePath)
    }

    async getExportedClassExplorers() {
        if (!this._exportedclassExplorers) {
            this._exportedclassExplorers = (await this.getModuleExplorer()).classExplorers.filter(explorer => explorer.isToExport)
        }
        return this._exportedclassExplorers
    }

    async isToExport() {
        return (await this.getExportedClassExplorers()).length > 0
    }

    async getExportedClassExplorer() {
        const exportedclassExplorers = await this.getExportedClassExplorers()
        if (exportedclassExplorers.length > 1)
            throw new Error(`Cannot export more than one class from a single module file ${this.guestFile.relativePath}`)
        return exportedclassExplorers[0]
    }

    async getClassSchemaGenerator(parsingSession) {
        const classExplorer = await this.getExportedClassExplorer()
        const className = classExplorer.name

        const alreadyExistentGenerator = parsingSession.classes.get(className)
        if (alreadyExistentGenerator)
            new Error(`Class ${className} in module "${classExplorer.modulePath}" was already` +
                `exported in module "${alreadyExistentGenerator.classExplorer.modulePath}"`)

        const classSchemaGenerator = new ClassSchemaCreator(classExplorer)
        parsingSession.classes.set(className, classSchemaGenerator)
        return classSchemaGenerator
    }

    async getSchema(parsingSession) {
        (await this.getClassSchemaGenerator(parsingSession)).getSchema(parsingSession)
    }
}

module.exports = {ModuleSchemaCreator}