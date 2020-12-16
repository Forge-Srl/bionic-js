const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaBoolTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Boolean'
    }

    getJsToPrimitiveMethodName() {
        return 'getBoolean'
    }
}

module.exports = {JavaBoolTypeGenerator}