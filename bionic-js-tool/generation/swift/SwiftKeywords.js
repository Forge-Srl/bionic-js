const keywords = new Set([
    // Keywords used in declarations:
    'class', 'deinit', 'enum', 'extension', 'fileprivate', 'func', 'import', 'init', 'inout',
    'internal', 'let', 'open', 'operator', 'private', 'protocol', 'public', 'rethrows', 'static', 'struct', 'subscript',
    'typealias', 'var',
    // Keywords used in statements
    'break', 'case', 'continue', 'default', 'defer', 'do', 'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat',
    'return', 'switch', 'where', 'while',
    // Keywords used in expressions and types
    'as', 'Any', 'catch', 'false', 'is', 'nil', 'super', 'self', 'Self', 'throw', 'throws', 'true', 'try'])

class SwiftKeywords {

    static getSafeIdentifier(identifier) {
        return keywords.has(identifier) ? `\`${identifier}\`` : identifier
    }
}

module.exports = {SwiftKeywords}