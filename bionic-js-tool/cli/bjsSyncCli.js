const path = require('path')
const {BjsSync} = require('../filesystem/BjsSync')
//const {ConsoleLog} = require('./ConsoleLog')
const {DebugLog} = require('../filesystem/DebugLog')
const {Configuration} = require('../filesystem/Configuration')


async function main() {
    const consoleLog = new DebugLog()

    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        consoleLog.error('no configuration file specified')
        process.exit()
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const configuration = Configuration.fromPath(configAbsolutePath)
    const bjsSync = new BjsSync(configuration, consoleLog)
    await bjsSync.sync()

    process.exit()
}

main().catch(err => {
    console.error(err)
    process.exit()
})