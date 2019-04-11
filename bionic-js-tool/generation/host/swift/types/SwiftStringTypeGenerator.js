const SwiftTypeGenerator = require('./SwiftTypeGenerator')

class SwiftStringTypeGenerator extends SwiftTypeGenerator {

    getTypeStatement() {
        return 'String?'
    }

    getJsToPrimitiveMethodName() {
        return 'getString'
    }
}

module.exports = SwiftStringTypeGenerator