const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaIntTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Long'
    }

    getJsToPrimitiveMethodName() {
        return 'getLong'
    }
}

module.exports = {JavaIntTypeGenerator}