const {File} = require('./File')

class HostFile extends File {

    static build(guestFile, hostDirPath, guestNativeDirPath, language) {
        const languageCode = language.charAt(0).toUpperCase() + language.slice(1)
        const exportFieldName = `${languageCode}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(guestFile, hostDirPath, guestNativeDirPath)
    }

    constructor(path, hostDirPath, guestNativeDirPath, guestFile) {
        super(path, hostDirPath)
        Object.assign(this, {guestNativeDirPath, guestFile})
    }
}

module.exports = {HostFile}