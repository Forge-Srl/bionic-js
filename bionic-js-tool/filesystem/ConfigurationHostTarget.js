class ConfigurationHostTarget {

    static fromTargetObj(targetObj, path) {
        const target = new ConfigurationHostTarget(targetObj, path)
        target.checkMandatoryProps('hostLanguage', 'hostDir', 'packageDir')
        return target
    }

    constructor(targetObj, path) {
        this.targetObj = targetObj
        this.path = path
    }

    get errorLocationString() {
        return `config file "${this.path}" -> "hostTargets" property ->`
    }

    get hostLanguage() {
        if (!this._hostLanguage) {
            const hostLanguage = this.targetObj.hostLanguage
            this._hostLanguage = hostLanguage.charAt(0).toUpperCase() + hostLanguage.slice(1)
        }
        return this._hostLanguage
    }

    get hostDir() {
        return this.targetObj.hostDir
    }

    get packageDir() {
        return this.targetObj.packageDir
    }

    get xcodeProjectPath() {
        if (!this._xcodeProjectPath) {
            this.checkMandatoryProps('xcodeProjectPath')
            this._xcodeProjectPath = this.targetObj.xcodeProjectPath
        }
        return this._xcodeProjectPath
    }

    get compileTargets() {
        if (!this._compileTargets) {
            this.checkMandatoryProps('compileTargets')
            const compileTargets = this.targetObj.compileTargets
            if (!Array.isArray(compileTargets)) {
                throw new Error(`${this.errorLocationString} "compileTargets" property is not an array`)
            }
            this._compileTargets = compileTargets
        }
        return this._compileTargets
    }

    checkMandatoryProps(...propertyNames) {
        for (const propertyName of propertyNames) {
            if (!this.targetObj.hasOwnProperty(propertyName))
                throw new Error(`${this.errorLocationString} "${propertyName}" property is missing`)
        }
    }
}

module.exports = {ConfigurationHostTarget}