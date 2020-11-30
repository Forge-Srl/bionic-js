const {File} = require('./File')

class HostFile extends File {

    static build(annotatedFile, hostProjectConfig, projectName) {
        const exportFieldName = `${hostProjectConfig.language}HostFile`
        const LanguageHostFile = require(`./${exportFieldName}`)[exportFieldName]
        return LanguageHostFile.build(annotatedFile, hostProjectConfig, projectName)
    }

    constructor(path, hostDir, annotatedFile, projectName) {
        super(path, hostDir)
        Object.assign(this, {annotatedFile, projectName})
    }
}

module.exports = {HostFile}