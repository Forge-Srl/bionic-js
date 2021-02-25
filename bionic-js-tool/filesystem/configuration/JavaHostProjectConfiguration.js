const {Configuration} = require('./Configuration')
const {JavaTargetBundlesConfiguration} = require('./JavaTargetBundlesConfiguration')
const {Directory} = require('../Directory')
const path = require('path')
const {posixPath} = require('../../filesystem/posixPath')

class JavaHostProjectConfiguration extends Configuration {

    static fromObj(configObj, path, projectName) {
        return new JavaHostProjectConfiguration(configObj, path, projectName)
    }

    constructor(configObj, locator, projectName) {
        super(configObj, locator, [], ['type', 'projectPath', 'srcDirName', 'targetBundles',
            'basePackage', 'hostPackage', 'nativePackage'])
        Object.assign(this, {projectName})
    }

    get language() {
        return 'Java'
    }

    get commonSourceSet() {
        return 'main'
    }

    get projectPath() {
        return posixPath(this.configObj.projectPath)
    }

    get srcDirName() {
        return posixPath(this.configObj.srcDirName)
    }

    get basePackage() {
        return this.configObj.basePackage
    }

    get hostPackage() {
        return this.basePackage ? `${this.basePackage}.${this.configObj.hostPackage}` : this.configObj.hostPackage
    }

    get nativePackage() {
        return this.basePackage ? `${this.basePackage}.${this.configObj.nativePackage}` : this.configObj.nativePackage
    }

    get srcDir() {
        const srcDirPath = path.resolve(this.projectPath, this.srcDirName)
        return new Directory(srcDirPath, srcDirPath)
    }

    hostDir(sourceSet) {
        return this.srcDir
            .getSubDir(`${sourceSet}/java`)
            .getSubDir(this.hostPackage.replace(/\./g, '/'))
    }

    resourcesDir(sourceSet) {
        return this.srcDir
            .getSubDir(`${sourceSet}/resources`)
    }

    get targetBundles() {
        if (!this._targetBundles) {
            this._targetBundles = JavaTargetBundlesConfiguration.fromObj(
                this.configObj.targetBundles, `${this.locator} -> "targetBundles"`)
        }
        return this._targetBundles
    }

    get allTargetBundleNames() {
        if (!this._allTargetBundleNames) {
            this._allTargetBundleNames = [...new Set(this.targetBundles.map(bundle => bundle.bundleName))]
        }
        return this._allTargetBundleNames
    }

    getSourceSetsForBundles(bundleNames) {
        const includedCount = this.allTargetBundleNames.filter(bundleName => bundleNames.includes(bundleName)).length
        if (includedCount === this.allTargetBundleNames.length) {
            return [this.commonSourceSet]
        }

        return [...new Set(this.targetBundles
            .filter(bundle => bundleNames.includes(bundle.bundleName))
            .flatMap(bundle => bundle.sourceSets))]
    }
}

module.exports = {JavaHostProjectConfiguration}