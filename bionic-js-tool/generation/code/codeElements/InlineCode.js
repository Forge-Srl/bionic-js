class InlineCode {

    constructor(codeString) {
        this.codeString = codeString
    }

    appendToBuilder(stringBuilder, currentIndentation) {
        stringBuilder.append(this.codeString)
        return currentIndentation
    }
}

module.exports = InlineCode