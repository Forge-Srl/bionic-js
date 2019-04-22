class GenerationContext {

    constructor(lastUniqueId = 0) {
        Object.assign(this, {lastUniqueId})
    }

    getUniqueIdentifier(prefix) {
        return `${prefix}_bjs${this.lastUniqueId++}`
    }
}

module.exports = GenerationContext