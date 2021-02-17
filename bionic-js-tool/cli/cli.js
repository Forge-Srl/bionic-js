#!/usr/bin/env node

const path = require('path')
const {Command} = require('commander')
const {Bjs} = require('../Bjs')
const {Log} = require('../filesystem/Log')

const bjsCliProgram = new Command()
const log = new Log()
const bjs = new Bjs(log)
const workingDir = process.cwd()

bjsCliProgram
    .name('bionicjs')
    .description(bjs.info)
    .version(bjs.version)

bjsCliProgram
    .command('sync <configuration_path>')
    .description('Regenerate JS bundles and native bridging code, based on the given configuration')
    .action(async configurationPath => await bjs.synchronize(path.resolve(workingDir, configurationPath)))

bjsCliProgram.parseAsync(process.argv)
    .then(() => process.exit(log.processExitCode))
    .catch(error => {
        log.error(error)
        process.exit(1)
    })