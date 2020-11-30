const {Configuration} = require('./Configuration')
const {XcodeTargetBundlesConfiguration} = require('./XcodeTargetBundlesConfiguration')
const {Directory} = require('../Directory')
const path = require('path')

class XcodeHostProjectConfiguration extends Configuration {

    static fromObj(configObj, path) {
        return new XcodeHostProjectConfiguration(configObj, path)
    }

    constructor(configObj, locator) {
        super(configObj, locator, [], ['type', 'projectPath', 'hostDirName', 'targetBundles'])
    }

    get language() {
        return 'Swift'
    }

    get projectPath() {
        return this.configObj.projectPath
    }

    get hostDirName() {
        return this.configObj.hostDirName
    }

    get xcodeProjectBundle() {
        const xcodeProjectDirPath = path.parse(this.projectPath).dir
        return new Directory(this.projectPath, xcodeProjectDirPath)
    }

    get xcodeProjectFile() {
        return this.xcodeProjectBundle.getSubFile('project.pbxproj')
    }

    get xcodeProjectDir() {
        const xcodeProjectDirPath = this.xcodeProjectBundle.rootDirPath
        return new Directory(xcodeProjectDirPath, xcodeProjectDirPath)
    }

    get hostDir() {
        return this.xcodeProjectDir.getSubDir(this.hostDirName)
    }

    get targetBundles() {
        if (!this._targetBundles) {
            this._targetBundles = XcodeTargetBundlesConfiguration.fromObj(
                this.configObj.targetBundles, `${this.locator} -> "targetBundles"`)
        }
        return this._targetBundles
    }
}

module.exports = {XcodeHostProjectConfiguration}