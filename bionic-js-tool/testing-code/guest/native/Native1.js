const {Fuel} = require('Fuel')

class Native1  {
    
    // @bionic (String, Int)
    constructor(dataText, statusCode) {}
    
    // @bionic get dataText String
    get dataText() {}
    
    // @bionic get statusCode Int
    get statusCode() {}
    
    // @bionic get request HttpRequest
    get request() {}
    
    // This method is not native
    get allTheFuel() {
        return Fuel.all
    }
}

module.exports = {Native1}
