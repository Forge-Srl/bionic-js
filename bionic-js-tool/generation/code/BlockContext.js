class BlockContext {

    constructor(lastUniqueId) {
        Object.assign(this, {lastUniqueId})
    }

    getNextUniqueId() {
        return this.lastUniqueId++
    }
}

module.exports = BlockContext