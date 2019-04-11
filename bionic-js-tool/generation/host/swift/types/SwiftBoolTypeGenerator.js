const SwiftTypeGenerator = require('./SwiftTypeGenerator')

class SwiftBoolTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'Bool?'
    }

    getJsToPrimitiveMethodName() {
        return 'getBool'
    }
}

module.exports = SwiftBoolTypeGenerator