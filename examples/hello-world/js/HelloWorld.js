const HelloJsWorld = require('./HelloJsWorld')
const HelloNativeWorld = require('./HelloNativeWorld')

module.exports = class HelloWorld {
    
    // @bionic String
    static get hello() {
        return `${HelloJsWorld.hello} and ${HelloNativeWorld.hello}`
    }
}