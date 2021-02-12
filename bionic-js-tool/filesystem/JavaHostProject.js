const {FileWalker} = require('./FileWalker')
const {HostProjectFile} = require('./HostProjectFile')
const {BundleProjectFile} = require('./BundleProjectFile')
const {JS_FILE_EXT, JAVA_FILE_EXT, BJS_BUNDLE_SUFFIX} = require('./fileExtensions')

class JavaHostProject {

    constructor(config, log) {
        Object.assign(this, {config, log})
    }

    get targetKeysBundleMap() {
        const targetKeysBundleMap = new Map()
        for (const targetBundle of this.config.targetBundles) {
            for (const sourceSet of targetBundle.sourceSets) {
                targetKeysBundleMap.set(sourceSet, targetBundle.bundleName)
            }
        }
        return targetKeysBundleMap
    }

    getBundleDirName(bundleName) {
        return `${bundleName}${BJS_BUNDLE_SUFFIX}`
    }

    getBundleFileName(bundleName) {
        return `${bundleName}${JS_FILE_EXT}`
    }

    async getProjectFiles() {
        const targetKeysBundleMap = this.targetKeysBundleMap
        const bjsProjectFileName = `Bjs${this.config.projectName}.java`

        const processJavaFile = async (fileToProcess, bundles, sourceSet) => {
            const subId = fileToProcess.relativePath === bjsProjectFileName ? sourceSet : undefined
            return new HostProjectFile(fileToProcess.relativePath, bundles, await fileToProcess.asFile.getCodeContent(), subId)
        }

        const processBundleFile = async (fileToProcess, bundles) => {
            const bundleName = fileToProcess.base.slice(0, -BJS_BUNDLE_SUFFIX.length)
            const bundleFile = fileToProcess.asDir.getSubFile(this.getBundleFileName(bundleName))
            return new BundleProjectFile(bundleName, await bundleFile.getCodeContent(), bundles)
        }

        const filesToProcess = []
        for (let [sourceSet, bundleName] of targetKeysBundleMap.entries()) {
            const javaFilesWalker = new FileWalker(this.config.hostDir(sourceSet).path, [JAVA_FILE_EXT].map(ext => `**/*${ext}`))
            filesToProcess.push(...(await javaFilesWalker.getFiles())
                .map(async fileToProcess => await processJavaFile(fileToProcess, [bundleName], sourceSet)))

            const bundleFilesWalker = new FileWalker(this.config.resourcesDir(sourceSet).path, [BJS_BUNDLE_SUFFIX].map(ext => `**/*${ext}`), false)
            filesToProcess.push(...(await bundleFilesWalker.getFiles())
                .map(async fileToProcess => await processBundleFile(fileToProcess, [bundleName])))
        }

        const allTargets = [...new Set(targetKeysBundleMap.values())]
        const commonJavaFilesWalker = new FileWalker(this.config.hostDir(this.config.commonSourceSet).path, [JAVA_FILE_EXT].map(ext => `**/*${ext}`))
        filesToProcess.push(...(await commonJavaFilesWalker.getFiles())
            .map(async fileToProcess => await processJavaFile(fileToProcess, allTargets)))

        const commonBundleFilesWalker = new FileWalker(this.config.resourcesDir(this.config.commonSourceSet).path, [BJS_BUNDLE_SUFFIX].map(ext => `**/*${ext}`), false)
        filesToProcess.push(...(await commonBundleFilesWalker.getFiles())
            .map(async fileToProcess => await processBundleFile(fileToProcess, allTargets)))

        return (await Promise.all(filesToProcess)).filter(nonNull => nonNull)
    }

    async save() {
        const targetKeysBundleMap = this.targetKeysBundleMap
        for (let [sourceSet, bundleName] of targetKeysBundleMap.entries()) {
            await this.config.hostDir(sourceSet).cleanEmptyDirs(true)
            await this.config.resourcesDir(sourceSet).cleanEmptyDirs(true)
        }
        await this.config.hostDir(this.config.commonSourceSet).cleanEmptyDirs(true)
        await this.config.resourcesDir(this.config.commonSourceSet).cleanEmptyDirs(true)
    }

    /** REMOVE THINGS */

    async removeHostFileFromProject(pathRelativeToHostDir, bundleNames) {
        const sourceSets = this.config.getSourceSetsForBundles(bundleNames)

        for (const sourceSet of sourceSets) {
            const hostFile = this.config.hostDir(sourceSet)
                .getSubFile(pathRelativeToHostDir)

            try {
                await hostFile.delete()
            } catch (error) {
                error.message = `removing host file "${hostFile.relativePath}"\n${error.message}`
                throw error
            }
        }
    }

    async removeBundleFromProject(bundleName) {
        const bundleDirName = this.getBundleDirName(bundleName)
        const sourceSets = this.config.getSourceSetsForBundles([bundleName])

        for (const sourceSet of sourceSets) {
            const bundleDir = this.config.resourcesDir(sourceSet)
                .getSubDir(bundleDirName)

            try {
                await bundleDir.delete()
            } catch (error) {
                error.message = `removing bundle directory "${bundleDir.relativePath}"\n${error.message}`
                throw error
            }
        }
    }

    /** ADD THINGS */

    async addHostFileToProject(pathRelativeToHostDir, bundleNames, hostFileContent) {
        const sourceSets = this.config.getSourceSetsForBundles(bundleNames)

        for (const sourceSet of sourceSets) {
            const hostFile = this.config.hostDir(sourceSet)
                .getSubFile(pathRelativeToHostDir)

            try {
                await hostFile.dir.ensureExists()
                await hostFile.setContent(hostFileContent)
            } catch (error) {
                error.message = `writing host file "${hostFile.relativePath}"\n${error.message}`
                throw error
            }
        }
    }

    async addBundleToProject(bundleName, bundleFileContent) {
        const bundleDirName = this.getBundleDirName(bundleName)
        const sourceSets = this.config.getSourceSetsForBundles([bundleName])

        for (const sourceSet of sourceSets) {
            const bundleFile = this.config.resourcesDir(sourceSet)
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
    }
}

module.exports = {JavaHostProject}