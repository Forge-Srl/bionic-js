const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaStringTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'String'
    }

    getJsToPrimitiveMethodName() {
        return 'getString'
    }
}

module.exports = {JavaStringTypeGenerator}