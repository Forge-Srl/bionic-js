const path = require('path')
const {File} = require('./File')

class NodeDependencies {

    constructor(moduleDir) {
        Object.assign(this, {moduleDir})
    }

    async get packageObj() {
        if (!this._packageJsonObj) {
            const packageJsonFile = new File(path.join(this.moduleDir, 'package.json'), this.moduleDir)
            const fileContent = await packageJsonFile.getContent()
            this._packageJsonObj = JSON.parse(fileContent)
        }
        return this._packageJsonObj
    }

    async get dependencies() {
        const packageObj = (await this.packageObj).dependencies
    }



}