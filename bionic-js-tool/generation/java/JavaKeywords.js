const keywords = new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'false',
    'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof',
    'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'true', 'try', 'void', 'volatile', 'while'])

class JavaKeywords {

    static getSafeIdentifier(identifier) {
        return keywords.has(identifier) ? `$${identifier}$` : identifier
    }
}

module.exports = {JavaKeywords}