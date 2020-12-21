const t = require('../../test-utils')

describe('JavaUtils', () => {

    let JavaUtils

    beforeEach(() => {
        JavaUtils = t.requireModule('generation/java/JavaUtils').JavaUtils
    })

    test.each([
        ['something', 'something'],
        ['something/asd.js', 'something/asd.js'],
        ['something/native/default/package/asd.java', 'something/$native$/$default$/$package$/asd.java'],
        ['native/other.java', '$native$/other.java'],
    ])('pathToSafePath %s', (path, expected) => {
        expect(JavaUtils.pathToSafePath(path)).toBe(expected)
    })

    test.each([
        ['something/AClass.js', 'something'],
        ['something/native/default/package/AClass.java', 'something.$native$.$default$.$package$'],
        ['other/subpackage/Other.java', 'other.subpackage'],
        ['JustAFile.java', ''],
    ])('pathToPackage %s', (path, expected) => {
        expect(JavaUtils.pathToPackage(path)).toBe(expected)
    })

    test.each([
        ['base.pack', 'something/AClass.js', 'base.pack.something'],
        ['base.pack', 'native/AClass.java', 'base.pack.$native$'],
        ['base.pack', 'other/subpackage/Other.java', 'base.pack.other.subpackage'],
        ['base.pack', 'JustAFile.java', 'base.pack'],
        ['', 'something/AClass.js', 'something'],
        ['', 'native/AClass.java', '$native$'],
        ['', 'JustAFile.java', ''],
    ])('pathToPackage %s + %s', (base, path, expected) => {
        expect(JavaUtils.fullPackage(base, path)).toBe(expected)
    })
})