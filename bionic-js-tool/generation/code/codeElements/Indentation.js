class Indentation {

    static get indentationString() {
        return '    '
    }

    constructor(indentation = 0) {
        Object.assign(this, {indentation})
    }

    appendToBuilder(stringBuilder, currentIndentation) {
        let newIndentation = currentIndentation + this.indentation
        if (newIndentation > 0)
            stringBuilder.append(Indentation.indentationString.repeat(newIndentation))
        return newIndentation
    }
}

module.exports = {Indentation}