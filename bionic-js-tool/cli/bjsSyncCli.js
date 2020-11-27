const path = require('path')
const {BjsSync} = require('../filesystem/BjsSync')
const {Log} = require('../filesystem/Log')
const {BjsConfiguration} = require('../filesystem/configuration/BjsConfiguration')

async function main(args, workingDir, log) {
    if (args.length === 0 || args[0].trim() === '') {
        log.error('no configuration file specified')
        return
    }

    const configAbsolutePath = path.resolve(workingDir, args[0])
    const configuration = BjsConfiguration.fromPath(configAbsolutePath)
    const bjsSync = new BjsSync(configuration, log)
    await bjsSync.sync()
}

const log = new Log()
main(process.argv.slice(2), process.cwd(), log).then(() => {
    process.exit(log.processExitCode)
}).catch(error => {
    log.error(error)
    process.exit(1)
})