const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaFloatTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Double'
    }

    getJsToPrimitiveMethodName() {
        return 'getDouble'
    }
}

module.exports = {JavaFloatTypeGenerator}
