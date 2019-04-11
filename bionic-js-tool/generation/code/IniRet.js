const CodeBlock = require('../code/CodeBlock')

class IniRet {

    static create(blockContext) {
        return new IniRet(CodeBlock.create(), CodeBlock.create(), blockContext)
    }

    constructor(returningCode, initializationCode, blockContext) {
        Object.assign(this, {returningCode, initializationCode, blockContext})
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
}

module.exports = IniRet