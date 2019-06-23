// This is a require
const {Guest2} = require('./libs/Guest2')

// This is my guest class
class Guest1 {

    /* This method is used to greet someone
     * special ;-)
     */

    // @bionic get name String

    // @bionic String
    static get hello() {
        return 'Hello bionic!'
    }
    
    // @bionic () => Int
    static answerToQuestionOfLife() {
        return 42
    }

    // @bionic (Float, Float) => Int
    static add(number1, number2) {
        return number1 + number2
    }

    // @bionic (String)
    constructor(name) {
        Object.assign(this, {name})
    }
    
    // @bionic String
    set hello(name) {
        this.name = name
    }
    
    // @bionic String
    get hello() {
        return `Hello ${this.name}!`
    }
    
    // @bionic Guest2
    get guestClass() {
        return new Guest2(this.name)
    }
    
    // @bionic (Int) => String
    howAreYou(age) {
        return `${this.name} is ${age}`
    }
    
    // This method is not bionic
    privateMethod() {
        return 'Nevermind!'
    }
}

module.exports = {Guest1}
