const {File} = require('./File')

class HostFile extends File {

    static build(guestFile, targetConfig) {
        const exportFieldName = `${targetConfig.hostLanguage}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(guestFile, targetConfig)
    }

    constructor(path, hostDir, guestFile) {
        super(path, hostDir)
        Object.assign(this, {guestFile})
    }
}

module.exports = {HostFile}