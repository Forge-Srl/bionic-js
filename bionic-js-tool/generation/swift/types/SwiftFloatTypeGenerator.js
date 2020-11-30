const {SwiftTypeGenerator} = require('./SwiftTypeGenerator')

class SwiftFloatTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'Double?'
    }

    getJsToPrimitiveMethodName() {
        return 'getFloat'
    }
}

module.exports = {SwiftFloatTypeGenerator}
