const Indentation = require('./codeElements/Indentation')
const StringBuilder = require('./StringBuilder')
const NewLine = require('./codeElements/NewLine')
const InlineCode = require('./codeElements/InlineCode')

class CodeBlock {

    constructor(...codeElements) {
        this.codeElements = codeElements
    }

    static create(startIndentation = 0) {
        if (startIndentation)
            return new CodeBlock(new Indentation(startIndentation))
        else
            return new CodeBlock()
    }

    getString() {
        const builder = new StringBuilder()
        let indentation = 0
        for (const code of this.codeElements) {
            indentation = code.appendToBuilder(builder, indentation)
        }
        return builder.getString()
    }

    newLine() {
        this.codeElements.push(new NewLine(), new Indentation())
        return this
    }

    newLineIndenting(indentation = 1) {
        this.codeElements.push(new NewLine(), new Indentation(indentation))
        return this
    }

    newLineDeindenting() {
        return this.newLineIndenting(-1)
    }

    appendString(codeString) {
        this.codeElements.push(new InlineCode(codeString))
        return this
    }

    appendCodeBlock(codeBlock) {
        this.codeElements = this.codeElements.concat(codeBlock.codeElements)
        return this
    }

    appendCodeElement(codeElement) {
        this.codeElements.push(codeElement)
        return this
    }

    append(obj) {
        if (!obj) {
            return this
        } else if (typeof obj === 'string') {
            return this.appendString(obj)
        } else if (obj instanceof CodeBlock) {
            return this.appendCodeBlock(obj)
        } else if (obj.appendToBuilder) {
            return this.appendCodeElement(obj)
        } else {
            throw new Error('Object cannot be appended')
        }
    }

    get __() {
        return this
    }
}

module.exports = CodeBlock