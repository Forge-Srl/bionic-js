const {HostEnvironmentFile} = require('./HostEnvironmentFile')
const {JAVA_FILE_EXT} = require('./fileExtensions')
const {JavaHostEnvironmentFileGenerator} = require('../generation/java/JavaHostEnvironmentFileGenerator')

class JavaHostEnvironmentFile extends HostEnvironmentFile {

    static build(nativeFiles, bundleName, hostProjectConfig, projectName) {
        return hostProjectConfig.getSourceSetsForBundles([bundleName]).map(sourceSet => {
            const hostDir = hostProjectConfig.hostDir(sourceSet)
            const filePath = hostDir.getSubFile(`Bjs${projectName}${JAVA_FILE_EXT}`).path
            return new JavaHostEnvironmentFile(filePath, hostDir.path, bundleName, nativeFiles, projectName,
                hostProjectConfig.hostPackage, sourceSet)
        })
    }

    constructor(path, hostDirPath, bundleName, nativeFiles, projectName, basePackage, sourceSet) {
        super(path, hostDirPath, bundleName, nativeFiles, projectName)
        Object.assign(this, {basePackage, sourceSet})
    }

    async generate(hostProject) {
        const generator = new JavaHostEnvironmentFileGenerator(this.bundleName, this.nativeFiles, this.projectName,
            this.basePackage)
        await hostProject.setHostFileContent(this.relativePath, [this.bundleName], generator.getSource(),
            this.sourceSet)
    }
}

module.exports = {JavaHostEnvironmentFile}