const {Configuration} = require('./Configuration')
const {Directory} = require('../Directory')
const path = require('path')

class JavaHostProjectConfiguration extends Configuration {

    static fromObj(configObj, path) {
        return new JavaHostProjectConfiguration(configObj, path)
    }

    constructor(configObj, locator) {
        super(configObj, locator, [], ['type', 'projectPath', 'srcDirName', 'targetBundles', 'basePackage', 'hostPackage'])
    }

    get language() {
        return 'Java'
    }

    get projectPath() {
        return this.configObj.projectPath
    }

    get srcDirName() {
        return this.configObj.srcDirName
    }

    get basePackage() {
        return this.configObj.basePackage
    }

    get hostPackage() {
        return this.basePackage ? `${this.basePackage}.${this.configObj.hostPackage}` : this.configObj.hostPackage
    }

    get srcDir() {
        const srcDirPath = path.resolve(this.projectPath, this.srcDirName)
        return new Directory(srcDirPath, srcDirPath)
    }

    get hostDir() {
        return this.srcDir
            .getSubDir('main/java')
            .getSubDir(this.hostPackage.replace(/\./g, '/'))
    }

    get resourcesDir() {
        return this.srcDir
            .getSubDir('main/resources')
    }
}

module.exports = {JavaHostProjectConfiguration}