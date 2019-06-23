class Guest3 {
    
    constructor(guestName) {
        Object.assign(this, {guestName})
    }
    
    // @bionic String
    whoIs() {
        return `${this.guestName} is my guest!`
    }
}

module.exports = {Guest3}
