const {JavaTypeGenerator} = require('./JavaTypeGenerator')

class JavaDateTypeGenerator extends JavaTypeGenerator {

    getTypeStatement() {
        return 'Date'
    }

    getJsToPrimitiveMethodName() {
        return 'getDate'
    }
}

module.exports = {JavaDateTypeGenerator}
