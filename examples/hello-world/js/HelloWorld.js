import {HelloJsWorld} from './HelloJsWorld'
import {HelloNativeWorld} from './HelloNativeWorld'

class HelloWorld {
    
    // @bionic String
    static get hello() {
        return `${HelloJsWorld.hello} and ${HelloNativeWorld.hello}`
    }
}

export {HelloWorld}