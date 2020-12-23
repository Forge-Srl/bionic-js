const xcode = require('xcode')
const path = require('path')
const touch = require('touch')
const {HostProjectFile} = require('./HostProjectFile')
const {BundleProjectFile} = require('./BundleProjectFile')
const {JS_FILE_EXT, SWIFT_FILE_EXT, BJS_BUNDLE_SUFFIX} = require('./fileExtensions')
const BUNDLE_FILE_TYPE = '"wrapper.plug-in"'
const SOURCE_FILE_TYPE = 'sourcecode.swift'
const XCODE_PATH_SEPARATOR = '/'

class XcodeHostProject {

    constructor(config, log) {
        Object.assign(this, {config, log})
    }

    get project() {
        if (!this._project) {
            this._project = xcode.project(this.config.xcodeProjectFile.path).parseSync()
        }
        return this._project
    }

    get mainGroup() {
        const mainGroupKey = this.project.getFirstProject().firstProject.mainGroup
        return this.getGroupByKey(mainGroupKey)
    }

    get allTargetKeys() {
        const targetObjects = this.project.pbxNativeTargetSection()
        return Object.keys(targetObjects).filter(targetKey => targetObjects[targetKey].name)
    }

    get targetKeysFilesMap() {
        const targetKeysFilesMap = new Map()
        const buildFileMap = this.project.pbxBuildFileSection()
        const targetObjects = this.project.pbxNativeTargetSection()
        const nativeTargets = Object.keys(targetObjects).filter(targetKey => targetObjects[targetKey].buildPhases)
            .map(key => ({targetKey: key, targetName: targetObjects[key].name}))
        for (const nativeTarget of nativeTargets) {
            const fileRefs = [...this.project.pbxSourcesBuildPhaseObj(nativeTarget.targetKey).files,
                ...this.project.pbxResourcesBuildPhaseObj(nativeTarget.targetKey).files]
                .map(fileKey => buildFileMap[fileKey.value].fileRef)
            for (const fileRef of fileRefs) {
                const targetKeys = targetKeysFilesMap.get(fileRef)
                if (targetKeys) {
                    targetKeys.push(nativeTarget.targetName)
                } else {
                    targetKeysFilesMap.set(fileRef, [nativeTarget.targetName])
                }
            }
        }
        return targetKeysFilesMap
    }

    get targetKeysBundleMap() {
        const targetKeysBundleMap = new Map()
        for (const targetBundle of this.config.targetBundles) {
            for (const compileTarget of targetBundle.compileTargets) {
                targetKeysBundleMap.set(compileTarget, targetBundle.bundleName)
            }
        }
        return targetKeysBundleMap
    }

    getBundleDirName(bundleName) {
        return `Bjs${bundleName}/${bundleName}${BJS_BUNDLE_SUFFIX}`
    }

    getBundleFileName(bundleName) {
        return `${bundleName}${JS_FILE_EXT}`
    }

    getCompileTargetKeys(compileTargets) {
        const targetObjects = this.project.pbxNativeTargetSection()
        const allTargets = this.allTargetKeys.map(targetKey => ({key: targetKey, obj: targetObjects[targetKey]}))
        const targetKeys = []
        for (const compileTargetName of compileTargets) {
            const compileTarget = allTargets.find(target =>
                target.obj.name === compileTargetName || target.obj.name === `"${compileTargetName}"`)
            if (!compileTarget) {
                throw new Error(`compile target "${compileTargetName}" not found in the Xcode project`)
            }
            targetKeys.push(compileTarget.key)
        }
        return targetKeys
    }

    getCompileTargets(bundles) {
        return bundles.flatMap(bundleName => {
            const targetBundle = this.config.targetBundles.find(targetBundle => targetBundle.bundleName === bundleName)
            return targetBundle ? targetBundle.compileTargets : []
        })
    }

    encodePath(path) {
        if (path === null || path === undefined)
            return path
        return path.includes('"') ? `"${path.replace(/"/g, '\\"')}"` : path
    }

    decodePath(encodedPath) {
        if (encodedPath === null || encodedPath === undefined)
            return encodedPath
        const result = /^"?(.*?)"?$/s.exec(encodedPath)
        return result[1].replace(/\\"/g, '"')
    }

    normalizeRelativePath(pathToNormalize) {
        return pathToNormalize.split(XCODE_PATH_SEPARATOR).filter(part => part).join(XCODE_PATH_SEPARATOR)
    }

    buildNode(node, key, comment, fatherGroup) {
        if (node) {
            node = Object.assign({}, node)
            node.key = key

            const fatherPathParts = fatherGroup ? fatherGroup.relativePath.split(XCODE_PATH_SEPARATOR) : []
            const nodePath = this.decodePath(node.path)
            const nodePathParts = nodePath ? nodePath.split(XCODE_PATH_SEPARATOR) : []
            node.relativePath = [...fatherPathParts, ...nodePathParts].filter(part => part).join(XCODE_PATH_SEPARATOR)
            node.debugLocation = `${fatherGroup ? fatherGroup.debugLocation + XCODE_PATH_SEPARATOR : ''}${comment ? comment : 'Project'}`
            node.fileType = node.explicitFileType || node.lastKnownFileType
            if (node.sourceTree !== '"<group>"') {
                this.relativeToGroupWarning = this.relativeToGroupWarning || new Set()
                if (!this.relativeToGroupWarning.has(node.debugLocation)) {
                    this.log.warning(`"${node.debugLocation}": file location attribute is not "Relative to Group", this config `
                        + 'is not supported so the file will be skipped\n')
                    this.relativeToGroupWarning.add(node.debugLocation)
                }
                return null
            }
        }
        return node
    }

    getGroupByKey(key, fatherGroup) {
        const group = this.project.getPBXGroupByKey(key)
        const comment = this.project.getPBXGroupByKey(`${key}_comment`)
        return this.buildNode(group, key, comment, fatherGroup)
    }

    getFileByKey(key, fatherGroup) {
        const file = this.project.pbxFileReferenceSection()[key]
        const comment = this.project.pbxFileReferenceSection()[`${key}_comment`]
        return this.buildNode(file, key, comment, fatherGroup)
    }

    getGroupByDirPath(dirPath, fatherGroup = this.mainGroup) {
        dirPath = this.normalizeRelativePath(dirPath)
        if (dirPath === fatherGroup.relativePath)
            return fatherGroup

        for (const child of fatherGroup.children) {
            const childGroup = this.getGroupByKey(child.value, fatherGroup)
            if (!childGroup)
                continue

            const targetGroup = this.getGroupByDirPath(dirPath, childGroup)
            if (targetGroup)
                return targetGroup
        }
        return null
    }

    getFiles(group) {
        let files = []
        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value, group)

            if (childGroup) {
                files = [...files, ...this.getFiles(childGroup)]
            } else if (childFile) {
                files = [...files, childFile]
            }
        }
        return files
    }

    getFile(group, relativePath) {
        relativePath = this.normalizeRelativePath(relativePath)

        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            if (childGroup) {
                const childFile = this.getFile(childGroup, relativePath)
                if (childFile) {
                    return childFile
                }
                continue
            }

            const childFile = this.getFileByKey(child.value, group)
            if (childFile.relativePath === relativePath) {
                return {fatherGroup: group, file: childFile}
            }
        }
        return null
    }

    async getProjectFiles() {
        const hostDirGroup = this.getGroupByDirPath(this.config.hostDirName)
        if (!hostDirGroup)
            return []
        const xcodeFiles = this.getFiles(hostDirGroup)
        this.checkForIncompatibleHostFiles(xcodeFiles)

        const targetKeysFilesMap = this.targetKeysFilesMap
        const filesToProcess = xcodeFiles
            .map(xcodeFile => ({
                file: this.config.xcodeProjectDir.getSubFile(xcodeFile.relativePath).setRootDirPath(this.config.hostDir.path),
                targets: targetKeysFilesMap.get(xcodeFile.key),
            }))

        const targetKeysBundleMap = this.targetKeysBundleMap
        const processFile = async fileToProcess => {

            const bundlesSet = new Set()
            const targets = fileToProcess.targets ? fileToProcess.targets : []
            targets.forEach(target => {
                if (target.startsWith('"') && target.endsWith('"')) {
                    target = target.substr(1, target.length - 2)
                }
                const bundle = targetKeysBundleMap.get(target)
                if (bundle) {
                    bundlesSet.add(bundle)
                }
            })
            if (fileToProcess.file.ext === SWIFT_FILE_EXT) {
                return new HostProjectFile(fileToProcess.file.relativePath, [...bundlesSet], await fileToProcess.file.asFile.getContent())
            } else if (fileToProcess.file.base.endsWith(BJS_BUNDLE_SUFFIX)) {
                const bundleName = fileToProcess.file.base.slice(0, -BJS_BUNDLE_SUFFIX.length)
                const bundleFile = fileToProcess.file.asDir.getSubFile(this.getBundleFileName(bundleName))
                return new BundleProjectFile(bundleName, await bundleFile.getContent(), [...bundlesSet])
            }
        }
        return (await Promise.all(filesToProcess.map(filesToProcess => processFile(filesToProcess)))).filter(nonNull => nonNull)
    }

    checkForIncompatibleHostFiles(files) {
        const notSupportedFiles = files.filter(
            file => (file.fileType !== SOURCE_FILE_TYPE && file.fileType !== BUNDLE_FILE_TYPE) ||
                (file.fileType === BUNDLE_FILE_TYPE && !file.relativePath.endsWith(BJS_BUNDLE_SUFFIX)))
        if (notSupportedFiles.length) {
            const fileNames = notSupportedFiles.map(file => `"${file.relativePath}"`).join(', ')
            throw new Error(`${fileNames} not supported: only .swift source files and bundles with "${BJS_BUNDLE_SUFFIX}" suffix are allowed inside the host directory`)
        }
    }

    async cleanEmptyDirs() {
        const hostDirGroup = this.getGroupByDirPath(this.config.hostDirName)
        if (hostDirGroup)
            await this.cleanEmptyGroups(hostDirGroup)

        for (const bundleName of this.config.targetBundles.map(targetBundle => targetBundle.bundleName)) {
            const bundleDir = this.config.xcodeProjectDir
                .getSubDir(this.config.hostDirName)
                .getSubDir(this.getBundleDirName(bundleName))
            await bundleDir.cleanEmptyDirs(false)
        }
    }

    async save() {
        await this.cleanEmptyDirs()
        await this.config.xcodeProjectFile.setContent(this.project.writeSync())
        await touch(this.config.projectPath)
    }

    /** REMOVE THINGS */

    async removeHostFileFromProject(pathRelativeToHostDir, bundles) {
        const hostDirGroup = this.getGroupByDirPath(this.config.hostDirName)
        const hostFileRef = this.getFile(hostDirGroup, path.join(this.config.hostDirName, pathRelativeToHostDir))
        if (hostFileRef) {
            this.removePbxSourceFile(hostFileRef.fatherGroup, hostFileRef.file)
        }

        const hostFile = this.config.xcodeProjectDir
            .getSubDir(this.config.hostDirName)
            .getSubFile(pathRelativeToHostDir)

        try {
            await hostFile.delete()
        } catch (error) {
            error.message = `removing host file "${hostFile.relativePath}"\n${error.message}`
            throw error
        }
    }

    async removeBundleFromProject(bundleName) {
        const bundleDirName = this.getBundleDirName(bundleName)
        const hostDirGroup = this.getGroupByDirPath(this.config.hostDirName)
        const hostFileRef = this.getFile(hostDirGroup, path.join(this.config.hostDirName, bundleDirName))
        if (hostFileRef) {
            this.removePbxSourceFile(hostFileRef.fatherGroup, hostFileRef.file)
        }

        const bundleDir = this.config.xcodeProjectDir.getSubDir(this.config.hostDirName).getSubDir(bundleDirName)
        try {
            await bundleDir.delete()
        } catch (error) {
            error.message = `removing bundle directory "${bundleDir.relativePath}"\n${error.message}`
            throw error
        }
    }

    /* removeFromPbx* methods from the "xcode" library are buggy since they use only the file name to locate
       and delete a file entry, but 2 files can have the same name and different groups/dirs! For this reason
       the methods were reimplemented here
     */
    removeFromPbxFileReferenceSection(sourceFile) {
        const pbxFileReferenceSection = this.project.pbxFileReferenceSection()
        delete pbxFileReferenceSection[sourceFile.key]
        const commentKey = `${sourceFile.key}_comment`
        if (pbxFileReferenceSection[commentKey]) {
            delete pbxFileReferenceSection[commentKey]
        }
    }

    removeFromPbxGroup(groupKey, childKey) {
        const pbxGroup = this.project.getPBXGroupByKey(groupKey)
        pbxGroup.children = pbxGroup.children.filter(child => child.value !== childKey)
    }

    removeFromPbxBuildFileSection(sourceFile) {
        const pbx = this.project.pbxBuildFileSection()
        const buildFileKeys = Object.getOwnPropertyNames(pbx).filter(key => pbx[key].fileRef === sourceFile.key)
        for (const key of buildFileKeys) {
            delete pbx[key]
            const commentKey = `${key}_comment`
            if (pbx[commentKey]) {
                delete pbx[commentKey]
            }
        }
        return buildFileKeys
    }

    removeFromPbxSourcesBuildPhase(targetKey, buildFileKey) {
        const sources = this.project.pbxSourcesBuildPhaseObj(targetKey)
        for (const sourceFileIndex in sources.files) {
            if (sources.files[sourceFileIndex].value === buildFileKey) {
                sources.files.splice(sourceFileIndex, 1)
                return
            }
        }
    }

    removeFromPbxResourcesBuildPhase(targetKey, buildFileKey) {
        const resources = this.project.pbxResourcesBuildPhaseObj(targetKey)
        for (const resourceFileIndex in resources.files) {
            if (resources.files[resourceFileIndex].value === buildFileKey) {
                resources.files.splice(resourceFileIndex, 1)
                return
            }
        }
    }

    removePbxSourceFile(father, sourceFile) {
        this.removeFromPbxFileReferenceSection(sourceFile)
        this.removeFromPbxGroup(father.key, sourceFile.key)
        const buildFileKeys = this.removeFromPbxBuildFileSection(sourceFile)

        for (const targetKey of this.allTargetKeys) {
            for (const buildFileKey of buildFileKeys) {
                if (sourceFile.fileType === SOURCE_FILE_TYPE) {
                    this.removeFromPbxSourcesBuildPhase(targetKey, buildFileKey)
                } else {
                    this.removeFromPbxResourcesBuildPhase(targetKey, buildFileKey)
                }
            }
        }
    }

    async cleanEmptyGroups(group, fatherGroup) {
        let empty = true
        for (const child of group.children) {
            const childGroup = this.getGroupByKey(child.value, group)
            const childFile = this.getFileByKey(child.value, group)
            if (childGroup) {
                const isChildGroupEmpty = await this.cleanEmptyGroups(childGroup, group)
                empty = isChildGroupEmpty && empty
            } else if (childFile) {
                empty = false
            }
        }
        if (empty && fatherGroup) {
            this.removeFromPbxGroup(fatherGroup.key, group.key)
            this.removePbxGroup(group)
            await this.config.xcodeProjectDir.getSubDir(group.relativePath).delete()
        }
        return empty
    }

    removePbxGroup(group) {
        const pbxGroup = this.project.hash.project.objects['PBXGroup']
        delete pbxGroup[group.key]
        delete pbxGroup[`${group.key}_comment`]
    }


    /** ADD THINGS */

    async addHostFileToProject(pathRelativeToHostDir, bundles, hostFileContent) {
        this.addFileToProject(pathRelativeToHostDir, bundles, false)

        const hostFile = this.config.xcodeProjectDir
            .getSubDir(this.config.hostDirName)
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
        this.addFileToProject(bundleDirName, [bundleName], true)

        const bundleFile = this.config.xcodeProjectDir
            .getSubDir(this.config.hostDirName)
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

    addFileToProject(pathRelativeToHostDir, bundles, isBundleDir) {
        const parsedFilePath = path.parse(path.join(this.config.hostDirName, pathRelativeToHostDir))
        const fatherGroup = this.ensureGroupExists(parsedFilePath.dir)

        const fileBaseName = parsedFilePath.base
        if (fatherGroup.children.some(child => child.comment === fileBaseName))
            return

        const fileKey = this.project.generateUuid()

        const pbxFile = {
            isa: 'PBXFileReference',
            path: this.encodePath(fileBaseName),
            sourceTree: '"<group>"',
            lastKnownFileType: isBundleDir ? '"wrapper.plug-in"' : 'sourcecode.swift',
        }
        if (!isBundleDir) {
            pbxFile.fileEncoding = 4
        }
        this.project.pbxFileReferenceSection()[fileKey] = pbxFile
        const commentKey = `${fileKey}_comment`
        this.project.pbxFileReferenceSection()[commentKey] = fileBaseName

        const file = {fileRef: fileKey, basename: fileBaseName}
        this.project.addToPbxGroup(file, fatherGroup.key)


        for (const targetKey of this.getCompileTargetKeys(this.getCompileTargets(bundles))) {
            file.uuid = this.project.generateUuid()
            file.group = isBundleDir ? 'Resources' : 'Sources'
            this.project.addToPbxBuildFileSection(file)

            file.target = targetKey
            if (isBundleDir) {
                this.project.addToPbxResourcesBuildPhase(file)
            } else {
                this.project.addToPbxSourcesBuildPhase(file)
            }
        }
    }

    ensureGroupExists(targetDirPath, fatherGroupPath = '') {
        targetDirPath = this.normalizeRelativePath(targetDirPath)
        const fatherGroup = this.getGroupByDirPath(fatherGroupPath)

        if (targetDirPath === '')
            return fatherGroup

        const targetDirPathParts = targetDirPath.split(XCODE_PATH_SEPARATOR)
        const targetChildGroupName = targetDirPathParts[0]
        let childGroup = this.getGroupByDirPath(path.join(fatherGroupPath, targetChildGroupName))

        if (!childGroup) {
            const pbxGroupUuid = this.project.generateUuid()
            const commentKey = `${pbxGroupUuid}_comment`
            const pbxGroup = {
                isa: 'PBXGroup',
                children: [],
                path: this.encodePath(targetChildGroupName),
                sourceTree: '"<group>"',
            }

            const groups = this.project.hash.project.objects['PBXGroup']

            groups[pbxGroupUuid] = pbxGroup
            groups[commentKey] = targetChildGroupName
            groups[fatherGroup.key].children.push({value: pbxGroupUuid, comment: targetChildGroupName})
            childGroup = this.getGroupByKey(pbxGroupUuid, fatherGroup)
        }

        const remainingTargetDirPath = targetDirPathParts.slice(1, targetDirPathParts.length).join(XCODE_PATH_SEPARATOR)
        return this.ensureGroupExists(remainingTargetDirPath, childGroup.relativePath)
    }
}

module.exports = {XcodeHostProject}