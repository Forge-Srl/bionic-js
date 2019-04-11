const SwiftTypeGenerator = require('./SwiftTypeGenerator')

class SwiftIntTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'Int?'
    }

    getJsToPrimitiveMethodName() {
        return 'getInt'
    }
}

module.exports = SwiftIntTypeGenerator