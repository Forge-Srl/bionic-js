const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaIntTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Integer'
    }

    getJsToPrimitiveMethodName() {
        return 'getInteger'
    }
}

module.exports = {JavaIntTypeGenerator}