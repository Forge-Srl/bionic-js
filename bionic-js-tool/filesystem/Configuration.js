const {NODE_MODULES_DIR_NAME, PACKAGE_JSON_LOCK_FILE_NAME} = require('./NodeModule')

class Configuration {

    constructor(guestDir, guestIgnores, guestNativeDir, hostDir, hostLanguage, packageDir) {
        this.guestDir = guestDir
        this.guestIgnores = guestIgnores
        this.guestNativeDir = guestNativeDir
        this.hostDir = hostDir
        this.hostLanguage = hostLanguage
        this.packageDir = packageDir
    }

    static async fromPath(filePath) {

        let config
        try {
            config = require(filePath)
        } catch (error) {
            error.message = `parsing the config file "${filePath}"\n${error.message}`
            throw error
        }

        this.checkMandatoryProps(filePath, config, {
            guestDir: 0,
            packageDir: 0,
            hostDir: 0,
            hostLanguage: 0,
        })

        let guestIgnores = []
        if (config.defaultGuestIgnores)
            guestIgnores.push(config.defaultGuestIgnores)
        else
            guestIgnores = guestIgnores.concat([NODE_MODULES_DIR_NAME, PACKAGE_JSON_LOCK_FILE_NAME])

        if (config.guestIgnores)
            guestIgnores = guestIgnores.concat(config.guestIgnores)

        return new Configuration(config.guestDir, guestIgnores, config.guestNativeDir, config.hostDir,
            config.hostLanguage, config.packageDir)
    }

    static checkMandatoryProps(filePath, config, props) {
        for (const prop in props) {
            if (!config.hasOwnProperty(prop))
                throw new Error(`the property "${prop}" is not defined in the configuration file "${filePath}"`)
        }
    }
}

module.exports = {Configuration}