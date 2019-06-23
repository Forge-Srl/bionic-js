const {JsonFile} = require('./JsonFile')

class ProcessorState {

    get toJson() {
        return JSON.stringify({
            guestSchemas: this.guestSchemas.entries(), // [GUEST HASH : SCHEMA FILE]
            packageHashes: this.packageHashes.entries(), // [GUEST PATH : PACKAGE HASH]
            hostHashes: this.hostHashes.entries(), // [GUEST PATH : HOST HASH]
        })
    }

    constructor(guestSchemasEntries, targetHashesEntries, hostHashesEntries) {
        this.guestSchemas = new Map(guestSchemasEntries)
        this.packageHashes = new Map(targetHashesEntries)
        this.hostHashes = new Map(hostHashesEntries)
    }

    static async fromFile(path) {
        try {
            const jsonFile = new JsonFile(path)
            return ProcessorState.fromObj(await jsonFile.getObject())

        } catch (error) {

            console.error(error.stack)
            console.warn(`Cannot read the last state from "${path}".\nUsing a default state.`)
            return new ProcessorState()
        }
    }

    static fromObj(obj) {
        return new ProcessorState(obj.guestSchemas, obj.packageHashes, obj.hostHashes)
    }

    getSchema(guestHash) {
        return this.guestSchemas.get(guestHash)
    }

    setSchema(guestHash, schema) {
        this.guestSchemas.set(guestHash, schema)
    }

    getPackageHash(guestPath) {
        this.packageHashes.get(guestPath)
    }

    setPackageHash(guestPath, packageHash) {
        this.packageHashes.set(guestPath, packageHash)
    }

    getHostHash(guestPath) {
        this.hostHashes.get(guestPath)
    }

    setHostHash(guestPath, hostHash) {
        this.hostHashes.set(guestPath, hostHash)
    }
}

module.exports = {ProcessorState}