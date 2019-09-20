const {File} = require('./File')

class HostFile extends File {

    static build(guestFile, hostDirPath, language) {
        const languageCode = language.charAt(0).toUpperCase() + language.slice(1)
        const exportFieldName = `${languageCode}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(guestFile, hostDirPath)
    }

    constructor(path, hostDirPath, guestFile) {
        super(path, hostDirPath)
        this.guestFile = guestFile
    }
}

module.exports = {HostFile}