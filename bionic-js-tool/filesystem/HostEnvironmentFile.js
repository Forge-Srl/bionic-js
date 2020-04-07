const {File} = require('./File')

class HostEnvironmentFile extends File {

    static build(nativePackageFiles, targetConfig) {
        const exportFieldName = `${targetConfig.hostLanguage}HostEnvironmentFile`
        const LanguageHostEnvironmentFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostEnvironmentFile.build(nativePackageFiles, targetConfig)
    }

    constructor(path, hostDir, packageName, nativePackageFiles) {
        super(path, hostDir)
        Object.assign(this, {packageName, nativePackageFiles})
    }
}

module.exports = {HostEnvironmentFile}