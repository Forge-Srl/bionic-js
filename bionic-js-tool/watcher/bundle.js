const path = require('path')
const {Configuration} = require('./Configuration')
const {GuestWatcher} = require('./GuestWatcher')
const {Directory} = require('./Directory')
const {PackageFile} = require('./PackageFile')

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        throw new Error('No config file specified')
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const config = await Configuration.fromPath(configAbsolutePath)

    const guestWatcher = await GuestWatcher.build(config)
    const guestFiles = await guestWatcher.getInitialFiles()

    await bundle(config.packageDir, config.hostDir, guestFiles)

    process.exit()
}

async function bundle(packageDirPath, hostDirPath, guestFiles) {
    const packageDir = new Directory(packageDirPath)
    console.log(`Deleting package dir: "${packageDir.path}"`)
    await packageDir.delete()

    const packageFiles = guestFiles.map(guestFile => PackageFile.build(guestFile, packageDir.path))
    await Promise.all(packageFiles.map(packageFile => {
        console.log(`Copying "${packageFile.path}"`)
        return packageFile.generate()
    }))
}

main().catch(err => {
    console.error(err)
    process.exit()
})