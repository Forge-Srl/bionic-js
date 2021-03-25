const path = require('path')
const {Command} = require('commander')
const {Log} = require('../filesystem/Log')
const {Bjs} = require('../Bjs')
const {bjsInteractiveConfiguration} = require('./bjsInteractiveConfiguration')

const getProgram = (log, workingDir) => {
    const bjs = new Bjs(log)
    const bjsCliProgram = new Command()
    const resolvePath = pathToResolve => path.resolve(workingDir, pathToResolve)

    bjsCliProgram
        .name('bionicjs')
        .description(Bjs.info)
        .version(Bjs.version)

    bjsCliProgram
        .command('init [configuration_path]')
        .description(
            'create a new configuration file interactively',
            {
                'configuration_path': 'the place where to store the configuration file',
            })
        .action(async (configurationPath) => {
            const rawConfigData = await bjsInteractiveConfiguration()
            const absolutePath = resolvePath(configurationPath || `${rawConfigData.projectName}.bjsconfig.js`)
            await bjs.initializeConfiguration(absolutePath, rawConfigData)
        })

    bjsCliProgram
        .command('clean <configuration_path>')
        .description('remove generated JS bundles and native bridging code, based on the given configuration')
        .action(async configurationPath => await bjs.clean(resolvePath(configurationPath)))

    bjsCliProgram
        .command('sync <configuration_path>')
        .option('-f, --force', 'force regeneration of all files')
        .description('regenerate JS bundles and native bridging code, based on the given configuration')
        .action(async (configurationPath, options) =>
            await bjs.synchronize(resolvePath(configurationPath), options.force))

    return bjsCliProgram
}

const start = () => {
    const log = new Log()

    getProgram(log, process.cwd())
        .parseAsync(process.argv)
        .then(() => process.exit(log.processExitCode))
        .catch(error => {
            log.error(error)
            process.exit(1)
        })
}

module.exports = {getProgram, start}