const {HostProject} = require('./HostProject')
const {BjsSyncStats} = require('./BjsSyncStats')
const {GuestWalker} = require('./GuestWalker')
const {GuestBundler} = require('./GuestBundler')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const {HostFile} = require('./HostFile')
const {HostEnvironmentFile} = require('./HostEnvironmentFile')
const bjsVersion = require('../package.json').version

class BjsSync {

    constructor(configuration, log) {
        Object.assign(this, {configuration, log})
    }

    async sync() {
        try {
            this.log.info(`Bionic.js - v${bjsVersion}\n\n`)
            const bjsSyncStats = new BjsSyncStats()
            this.configuration.validate()

            const guestFiles = await this.getGuestFiles()
            const annotatedFiles = await this.getAnnotatedFiles(guestFiles)
            const bundles = await this.generateBundles(annotatedFiles)

            for (const projectConfig of this.configuration.hostProjects) {
                const hostProject = await this.openHostProject(projectConfig, bjsSyncStats)
                await this.syncBundles(hostProject, annotatedFiles, bundles)
                await this.syncHostFiles(hostProject, annotatedFiles)
                await this.saveHostProject(hostProject)
            }
            bjsSyncStats.logStats(this.log)
        } catch (error) {
            this.log.error(error)
        }
    }

    async getGuestFiles() {
        this.log.info('Analyzing guest files dependencies\n')
        return await GuestWalker.build(this.configuration).getFiles()
    }

    async getAnnotatedFiles(guestFiles) {
        this.log.info('Extracting schemas from guest files\n')
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)
        return await globalSchemaCreator.getAnnotatedFiles()
    }

    async generateBundles(annotatedFiles) {
        this.log.info('Generating bundles\n')
        const bundler = GuestBundler.build(annotatedFiles, this.configuration)
        return bundler.makeBundles()
    }

    async openHostProject(hostProjectConfig, bjsSyncStats) {
        const hostProject = HostProject.build(hostProjectConfig, this.log, bjsSyncStats)
        this.log.info(`Opening ${hostProjectConfig.language} host project\n`)
        await hostProject.open()
        return hostProject
    }

    async syncHostFiles(hostProject, annotatedFiles) {
        this.log.info('Writing host files\n')
        await Promise.all(annotatedFiles.filter(annotatedFile => annotatedFile.exportsClass)
            .map(annotatedFile => HostFile.build(annotatedFile, hostProject.configuration,
                this.configuration.projectName).generate(hostProject)))
    }

    async syncBundles(hostProject, annotatedFiles, bundles) {
        this.log.info('Writing bundles\n')
        for (const {name: bundleName, content: bundleContent} of bundles) {
            const hostEnvironmentFile = HostEnvironmentFile.build(annotatedFiles
                    .filter(file => file.exportsNativeClass && file.guestFile.bundles.includes(bundleName)),
                bundleName, hostProject.configuration, this.configuration.projectName)
            await hostEnvironmentFile.generate(hostProject)
            await hostProject.setBundleFileContent(bundleName, bundleContent)
        }
    }

    async saveHostProject(hostProject) {
        this.log.info(`Writing ${hostProject.configuration.language} host project\n`)
        await hostProject.save()
    }
}

module.exports = {BjsSync}