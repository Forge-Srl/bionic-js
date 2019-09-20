const path = require('path')
const {BjsSync} = require('./BjsSync')
const {ConsoleLog} = require('./ConsoleLog')

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        throw new Error('no config file specified')
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const bjsSync = new BjsSync(configAbsolutePath, new ConsoleLog())
    await bjsSync.sync()

    process.exit()
}

main().catch(err => {
    console.error(err)
    process.exit()
})