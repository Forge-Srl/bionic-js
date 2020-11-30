class NewLine {

    appendToBuilder(stringBuilder, currentIndentation) {
        stringBuilder.append('\n')
        return currentIndentation
    }
}

module.exports = {NewLine}