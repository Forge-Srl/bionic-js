const {Directory} = require('./Directory')

const NODE_MODULES_DIR_NAME = 'node_modules'
const PACKAGE_JSON_FILE_NAME = 'package.json'
const PACKAGE_JSON_LOCK_FILE_NAME = 'package-lock.json'

class NodeModule {

    static fromModulePath(moduleDirPath) {
        return new NodeModule(new Directory(moduleDirPath, moduleDirPath))
    }

    static async getDependencyModule(dependencyName, rootModule, currentModule, originalModule = currentModule) {
        const candidateDependency = new NodeModule(currentModule.nodeModulesDir.getSubDir(dependencyName))
        if (await candidateDependency.packageFile.isReadable()) {
            return candidateDependency
        }
        if (currentModule.moduleDir.absolutePath === rootModule.moduleDir.absolutePath) {
            throw new Error(`Dependency "${dependencyName}" in module "${originalModule.moduleDir.relativePath}" cannot be resolved`)
        }
        const parentModule = new NodeModule(currentModule.moduleDir.dir.dir)

        return this.getDependencyModule(dependencyName, rootModule, parentModule, originalModule)
    }

    constructor(moduleDir) {
        Object.assign(this, {moduleDir})
    }

    get nodeModulesDir() {
        if (!this._nodeModulesDir) {
            this._nodeModulesDir = this.moduleDir.getSubDir(NODE_MODULES_DIR_NAME)
        }
        return this._nodeModulesDir
    }

    get packageFile() {
        if (!this._packageFile) {
            this._packageFile = this.moduleDir.getSubFile(PACKAGE_JSON_FILE_NAME)
        }
        return this._packageFile
    }

    async getPackageObj() {
        if (!this._packageObj) {
            try {
                const fileContent = await this.packageFile.getContent()
                this._packageObj = JSON.parse(fileContent)
            } catch (e) {

            }
        }
        return this._packageObj
    }

    async getShallowDependenciesNames() {
        if (!this._dependenciesNames) {
            try {
                const dependencies = (await this.getPackageObj()).dependencies
                this._dependenciesNames = dependencies ? Object.keys(dependencies) : []
            } catch (e) {
                throw new Error(`Cannot read package.json file in module "${this.moduleDir.path}"`)
            }
        }
        return this._dependenciesNames
    }

    async getShallowDependencies(rootModule) {
        const packagePromises = (await this.getShallowDependenciesNames())
            .map(depName => NodeModule.getDependencyModule(depName, rootModule, this))
        return await Promise.all(packagePromises)
    }

    async getDependencies(allDependencies, rootModule) {
        if (!allDependencies) {
            allDependencies = new Map()
        }
        if (!rootModule) {
            rootModule = this
        }

        const dependencies = []
        const shallowDependencies = await this.getShallowDependencies(rootModule)

        for (const dependency of shallowDependencies) {
            if (!allDependencies.has(dependency.packageFile.path)) {
                allDependencies.set(dependency.packageFile.path, dependency)
                dependencies.push(dependency, ...(await dependency.getDependencies(allDependencies, rootModule)))
            }
        }
        return dependencies
    }
}

module.exports = {NodeModule, NODE_MODULES_DIR_NAME, PACKAGE_JSON_FILE_NAME, PACKAGE_JSON_LOCK_FILE_NAME}