const {XcodeHostProject} = require('./XcodeHostProject')

class HostProject {

    static build(targetConfig, log) {
        if (targetConfig.hostLanguage === 'Swift') {
            return new XcodeHostProject(targetConfig, log)
        } else {
            throw new Error(`the hostLanguage "${targetConfig.hostLanguage}" required in the configuration is not supported`)
        }
    }
}

module.exports = {HostProject}