class JavaGenerationContext {

    constructor(lastUniqueId = 0) {
        Object.assign(this, {lastUniqueId})
    }

    get bjsEntrance() {
        return 'bjs'
    }

    getUniqueIdentifier(prefix) {
        return `${prefix}_bjs${this.lastUniqueId++}`
    }
}

module.exports = {JavaGenerationContext}