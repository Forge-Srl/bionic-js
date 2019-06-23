const {File} = require('./File')

class HostFile extends File {

    constructor(path, hostDirPath, guestFile) {
        super(path, hostDirPath)
        this.guestFile = guestFile
    }

    static build(guestFile, hostDirPath, language) {
        const languageCode = language.charAt(0).toUpperCase() + language.slice(1)
        const LanguageHostFile = require(`./${languageCode}HostFile`)
        return LanguageHostFile.build(guestFile, hostDirPath)
    }
}

module.exports = {HostFile}