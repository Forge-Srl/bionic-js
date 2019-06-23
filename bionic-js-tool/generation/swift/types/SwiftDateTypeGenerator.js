const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')

class SwiftDateTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'Date?'
    }

    getJsToPrimitiveMethodName() {
        return 'getDate'
    }
}

module.exports = {SwiftDateTypeGenerator}
