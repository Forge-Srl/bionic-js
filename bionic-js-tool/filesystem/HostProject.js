const {XcodeHostProject} = require('./XcodeHostProject')

class HostProject {

    static build(targetConfig) {
        if (targetConfig.hostLanguage === 'Swift') {
            return new XcodeHostProject(targetConfig)
        } else {
            throw new Error(`the hostLanguage "${targetConfig.hostLanguage}" required in the configuration is not supported`)
        }
    }
}

module.exports = {HostProject}