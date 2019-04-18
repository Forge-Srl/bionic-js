class GenerationContext {

    constructor(lastUniqueId = 0) {
        Object.assign(this, {lastUniqueId})
    }

    getNextUniqueId() {
        return this.lastUniqueId++
    }
}

module.exports = GenerationContext