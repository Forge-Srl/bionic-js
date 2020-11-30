const {File} = require('./File')

class HostEnvironmentFile extends File {

    static build(nativeFiles, bundleName, hostProjectConfig, projectName) {
        const exportFieldName = `${hostProjectConfig.language}HostEnvironmentFile`
        const LanguageHostEnvironmentFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostEnvironmentFile.build(nativeFiles, bundleName, hostProjectConfig, projectName)
    }

    constructor(path, hostDirPath, bundleName, nativeFiles, projectName) {
        super(path, hostDirPath)
        Object.assign(this, {bundleName, nativeFiles, projectName})
    }
}

module.exports = {HostEnvironmentFile}