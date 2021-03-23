#!/usr/bin/env node

const path = require('path')
const workingDir = process.cwd()
const resolvePath = pathToResolve => path.resolve(workingDir, pathToResolve)

const {Command} = require('commander')
const {Bjs} = require('../Bjs')
const {Log} = require('../filesystem/Log')

const bjsCliProgram = new Command()
const log = new Log()
const bjs = new Bjs(log)

bjsCliProgram
    .name('bionicjs')
    .description(Bjs.info)
    .version(Bjs.version)

bjsCliProgram
    .command('clean <configuration_path>')
    .description('remove generated JS bundles and native bridging code, based on the given configuration')
    .action(async configurationPath => await bjs.clean(resolvePath(configurationPath)))

bjsCliProgram
    .command('sync <configuration_path>')
    .option('-f, --force', 'force regeneration of all files')
    .description('regenerate JS bundles and native bridging code, based on the given configuration')
    .action(async (configurationPath, options) => await bjs.synchronize(resolvePath(configurationPath), options.force))

bjsCliProgram.parseAsync(process.argv)
    .then(() => process.exit(log.processExitCode))
    .catch(error => {
        log.error(error)
        process.exit(1)
    })