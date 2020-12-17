const {FileWalker} = require('./FileWalker')
const {HostProjectFile} = require('./HostProjectFile')
const {BundleProjectFile} = require('./BundleProjectFile')
const {JS_FILE_EXT, JAVA_FILE_EXT, BJS_BUNDLE_SUFFIX} = require('./fileExtensions')

class JavaHostProject {

    constructor(config, log) {
        Object.assign(this, {config, log})
    }

    getBundleDirName(bundleName) {
        return `${bundleName}${BJS_BUNDLE_SUFFIX}`
    }

    getBundleFileName(bundleName) {
        return `${bundleName}${JS_FILE_EXT}`
    }

    async getProjectFiles() {
        const javaFilesWalker = new FileWalker(this.config.hostDir.path, [JAVA_FILE_EXT].map(ext => `**/*${ext}`))
        const javaFilesToProcess = (await javaFilesWalker.getFiles()).map(async fileToProcess => {
            return new HostProjectFile(fileToProcess.relativePath, ['main'], await fileToProcess.asFile.getContent())
        })

        const bundleFilesWalker = new FileWalker(this.config.resourcesDir.path, [BJS_BUNDLE_SUFFIX].map(ext => `**/*${ext}`), false)
        const bundleFilesToProcess = (await bundleFilesWalker.getFiles()).map(async fileToProcess => {
            const bundleName = fileToProcess.base.slice(0, -BJS_BUNDLE_SUFFIX.length)
            const bundleFile = fileToProcess.asDir.getSubFile(this.getBundleFileName(bundleName))
            return new BundleProjectFile(bundleName, await bundleFile.getContent(), ['main'])
        })

        return (await Promise.all([...javaFilesToProcess, ...bundleFilesToProcess])).filter(nonNull => nonNull)
    }

    async save() {
        await this.config.hostDir.cleanEmptyDirs(true)
        await this.config.resourcesDir.cleanEmptyDirs(true)
    }

    /** REMOVE THINGS */

    async removeHostFileFromProject(pathRelativeToHostDir) {
        const hostFile = this.config.hostDir
            .getSubFile(pathRelativeToHostDir)

        try {
            await hostFile.delete()
        } catch (error) {
            error.message = `removing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    /** ADD THINGS */

    async addHostFileToProject(pathRelativeToHostDir, bundles, hostFileContent) {
        const hostFile = this.config.hostDir
            .getSubFile(pathRelativeToHostDir)

        try {
            await hostFile.dir.ensureExists()
            await hostFile.setContent(hostFileContent)
        } catch (error) {
            error.message = `writing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async addBundleToProject(bundleName, bundleFileContent) {
        const bundleDirName = this.getBundleDirName(bundleName)

        const bundleFile = this.config.resourcesDir
            .getSubDir(bundleDirName)
            .getSubFile(this.getBundleFileName(bundleName))

        try {
            await bundleFile.dir.ensureExists()
            await bundleFile.setContent(bundleFileContent)
        } catch (error) {
            error.message = `writing bundle file "${bundleFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async removeBundleFromProject(bundleName) {
        const bundleDirName = this.getBundleDirName(bundleName)
        const bundleDir = this.config.resourcesDir.getSubDir(bundleDirName)
        try {
            await bundleDir.delete()
        } catch (error) {
            error.message = `removing bundle directory "${bundleDir.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {JavaHostProject}