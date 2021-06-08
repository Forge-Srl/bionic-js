const keywords = new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'false',
    'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof',
    'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'true', 'try', 'void', 'volatile', 'while'])

class JavaKeywords {

    static getSafeIdentifier(identifier) {
        if (identifier.match(/^[A-Za-z0-9_$]+$/gu)) {
            return keywords.has(identifier) || identifier.match(/^\d/) ? `$${identifier}$` : identifier
        }

        const invalidCharsRegex = /(?<chars>(?:.(?<![A-Za-z0-9_$]+))+)/gu
        const substringsToEscape = []
        let match = invalidCharsRegex.exec(identifier)
        do {
            substringsToEscape.push(match.groups.chars)
        } while ((match = invalidCharsRegex.exec(identifier)) !== null)

        const alreadyEscaped = identifier
            .split(invalidCharsRegex)
            .filter(str => str.length !== 0 && !substringsToEscape.includes(str))
            .join('_')

        const escapedChars = substringsToEscape
            .map(chars => Buffer.from(chars).toString('base64')
                .split('=').join('$')
                .split('-').join('_'))
            .join('_')

        return `$${alreadyEscaped}$${escapedChars}`
    }
}

module.exports = {JavaKeywords}