const path = require('path')
const {BjsSync} = require('./BjsSync')

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        throw new Error('No config file specified')
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const bjsSync = new BjsSync(configAbsolutePath, {logInfo: message => console.log(message)})
    await bjsSync.sync()

    process.exit()
}

main().catch(err => {
    console.error(err)
    process.exit()
})