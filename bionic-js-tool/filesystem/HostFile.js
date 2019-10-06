const {File} = require('./File')

class HostFile extends File {

    static build(guestFile, config) {
        const exportFieldName = `${config.hostLanguage}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(guestFile, config)
    }

    constructor(path, hostDir, guestFile, isNativeWrapper) {
        super(path, hostDir)
        Object.assign(this, {guestFile, isNativeWrapper})
    }
}

module.exports = {HostFile}