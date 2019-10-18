const path = require('path')
const {BaseFile} = require('./BaseFile')

class ConfigurationHostTarget {

    static fromTargetObj(targetObj, path) {
        const target = new ConfigurationHostTarget(targetObj, path)
        target.checkMandatoryProps('hostLanguage', 'hostDirName', 'xcodeProjectPath', 'compileTargets')
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
        const hostLanguage = this.targetObj.hostLanguage
        return hostLanguage.charAt(0).toUpperCase() + hostLanguage.slice(1)
    }

    get hostDirPath() {
        const hostDirPath = path.resolve(this.xcodeProjectDirPath, this.targetObj.hostDirName || 'Bjs')
        const hostDir = new BaseFile(hostDirPath)
        if (!hostDir.isInsideDir(this.xcodeProjectDirPath)) {
            throw new Error(`${this.errorLocationString} "hostDirName" must be a directory inside "${this.xcodeProjectDirPath}"`)
        }
        return hostDirPath
    }

    get packageName() {
        const packageName = this.targetObj.packageName
        if (packageName) {
            const testHostFile = new BaseFile(packageName)
            if (testHostFile.base !== packageName) {
                throw new Error(`${this.errorLocationString} "packageName" must be a file name`)
            }
            if (testHostFile.ext !== '.bundle') {
                throw new Error(`${this.errorLocationString} "packageName" must be a .bundle file`)
            }
            return packageName
        } else {
            return 'package.bundle'
        }
    }

    get xcodeProjectPath() {
        return this.targetObj.xcodeProjectPath
    }

    get xcodeProjectDirPath() {
        return path.parse(this.xcodeProjectPath).dir
    }

    get compileTargets() {
        const compileTargets = this.targetObj.compileTargets
        if (!Array.isArray(compileTargets)) {
            throw new Error(`${this.errorLocationString} "compileTargets" is not an array`)
        }
        return compileTargets
    }

    checkMandatoryProps(...propertyNames) {
        for (const propertyName of propertyNames) {
            if (!this.targetObj.hasOwnProperty(propertyName))
                throw new Error(`${this.errorLocationString} "${propertyName}" is missing`)
        }
    }
}

module.exports = {ConfigurationHostTarget}