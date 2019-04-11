const ProcessorState = require('./ProcessorState')
const PackageFile = require('./PackageFile')
const HostFile = require('./HostFile')
const Directory = require('./Directory')

class Processor {

    constructor(config, guestFiles, packageFiles, hostFiles) {
        this.config = config

        this.current = {}
        Object.assign(this.current, {guestFiles, packageFiles, hostFiles})
        this.target = {}
        this.queues = {}
    }

    async getCurrentState() {
        if (!this.current.state) {
            this.current.state = await ProcessorState.fromFile(this.config.stateFile)
        }
        return this.current.state
    }

    async getGuestHashes() {
        if (!this.current.guestHashes) {
            this.current.guestHashes = await Promise.all(this.current.guestFiles.map(guestFile =>
                (async () => ({path: guestFile.path, hash: await guestFile.getHash()}))()
            ))
        }
        return this.current.guestHashes
    }

    async getParseQueue() {
        if (!this.queues.parseGuest) {
            this.queues.parseGuest = []
            for (const guestFile of await this.getGuestHashes()) {
                if (!(await this.getCurrentState()).getSchema(guestFile.hash)) {
                    this.queues.parseGuest.push(guestFile.path)
                }
            }
        }
        return this.queues.parseGuest
    }

    async start() {

    }


    /* v  SPECULATIVE CODE  v */

    async getGuestHashesMap() {
        if (!this.current.guestHashesMap) {
            this.current.guestHashesMap = new Map((await this.getGuestHashes()).map(guest => [guest.path, guest.hash]))
        }
        return this.current.guestHashesMap
    }

    async getGuestPathsMap() {
        if (!this.current.guestPathsMap) {
            this.current.guestPathsMap = new Map((await this.getGuestHashes()).map(guest => [guest.hash, guest.path]))
        }
        return this.current.guestPathsMap
    }

    getPackagesMap() {
        if (!this.target.packagesMap) {
            this.target.packagesMap = new Map(
                this.current.guestFiles.map(guestFile => {
                    const packageFile = PackageFile.build(guestFile, this.config.packageDir)
                    return [packageFile.path, packageFile]
                }))
        }
        return this.target.packagesMap
    }

    getHostsMap() {
        if (!this.target.hostsMap) {
            this.target.hostsMap = new Map(
                this.current.guestFiles.map(guestFile => {
                    const hostFile = HostFile.build(guestFile, this.config.hostDir)
                    return [hostFile.path, hostFile]
                }))
        }
        return this.target.hostsMap
    }

    async getCreatePackageQueue() {
        if (!this.queues.createPackage) {
            this.queues.createPackage = []
            await this.fillTargetQueue(this.getPackagesMap().values(), this.current.state.packageHashes,
                this.queues.createPackage)
        }
        return this.queues.createPackage
    }

    async getCreateHostQueue() {
        if (!this.queues.createHost) {
            this.queues.createHost = []
            await this.fillTargetQueue(this.getHostsMap().values(), this.current.state.hostHashes,
                this.queues.createHost)
        }
        return this.queues.createHost
    }

    async fillTargetQueue(targetFiles, targetHashes, creationQueue) {
        for (const targetFile of targetFiles) {
            const guestFile = targetFile.guestFile
            try {
                const currentTargetHash = targetHashes.get(guestFile.path)
                if (!currentTargetHash)
                    throw 'guest file is new'

                const targetFileHash = await targetFile.getHash()
                if (currentTargetHash !== targetFileHash)
                    throw 'target file is changed'

            } catch (error) {

                const guestHash = this.getGuestHashesMap().get(guestFile.path)
                creationQueue.push({path: targetFile.path, guestHash})
            }
        }
    }
}

module.exports = Processor