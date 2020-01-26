const {File} = require('./File')

class HostFile extends File {

    static build(exportedFile, targetConfig) {
        const exportFieldName = `${targetConfig.hostLanguage}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(exportedFile, targetConfig)
    }

    constructor(path, hostDir, exportedFile) {
        super(path, hostDir)
        Object.assign(this, {exportedFile})
    }
}

module.exports = {HostFile}