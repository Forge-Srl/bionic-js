const CodeBlock = require('../code/CodeBlock')

class IniRet {

    static create() {
        return new IniRet(CodeBlock.create(), CodeBlock.create())
    }

    constructor(returningCode, initializationCode) {
        Object.assign(this, {returningCode, initializationCode})
    }

    append(iniRet) {
        this.returningCode.append(iniRet.returningCode)
        this.initializationCode.append(iniRet.initializationCode)
        return this
    }

    appendRet(returningCode) {
        this.returningCode.append(returningCode)
        return this
    }

    appendIni(initializationCode) {
        this.initializationCode.append(initializationCode)
        return this
    }

    editRet(getReturningCode) {
        this.returningCode = getReturningCode(this.returningCode)
        return this
    }

    editIni(getInitializationCode) {
        this.initializationCode = getInitializationCode(this.initializationCode)
        return this
    }

    get __() {
        return this
    }
}

module.exports = IniRet