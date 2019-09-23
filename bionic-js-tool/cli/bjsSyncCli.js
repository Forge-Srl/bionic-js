const path = require('path')
const {BjsSync} = require('../filesystem/BjsSync')
const {ConsoleLog} = require('./ConsoleLog')

async function main() {
    const consoleLog = new ConsoleLog()

    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        consoleLog.error('no config file specified')
        process.exit()
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const bjsSync = new BjsSync(configAbsolutePath, consoleLog)
    await bjsSync.sync()

    process.exit()
}

main().catch(err => {
    console.error(err)
    process.exit()
})