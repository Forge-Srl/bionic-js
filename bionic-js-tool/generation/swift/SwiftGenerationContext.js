class SwiftGenerationContext {

    constructor(entranceClassName, lastUniqueId = 0) {
        Object.assign(this, {entranceClassName, lastUniqueId})
    }

    get bjsEntrance() {
        return this.entranceClassName ? `${this.entranceClassName}.bjs` : 'bjs'
    }

    getUniqueIdentifier(prefix) {
        return `${prefix}_bjs${this.lastUniqueId++}`
    }
}

module.exports = {SwiftGenerationContext}