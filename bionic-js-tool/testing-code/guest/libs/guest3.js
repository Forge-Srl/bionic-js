// @bionic
class Guest3 {
    
    constructor(guestName) {
        Object.assign(this, {guestName})
    }
    
    whoIs() {
        return `${this.guestName} is my guest!`
    }
}

module.exports = {Guest3}
