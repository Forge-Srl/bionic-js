const {HelloJsWorld} = require('./HelloJsWorld')
const {HelloNativeWorld} = require('./HelloNativeWorld')

class HelloWorld {
    
    // @bionic String
    static get hello() {
        return `${HelloJsWorld.hello} and ${HelloNativeWorld.hello}`
    }
}

module.exports = {HelloWorld}