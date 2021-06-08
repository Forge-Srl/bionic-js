const t = require('../../test-utils')

describe('JavaKeywords', () => {

    let JavaKeywords

    beforeEach(() => {
        JavaKeywords = t.requireModule('generation/java/JavaKeywords').JavaKeywords
    })

    test.each([
        ['itsSafe', 'itsSafe'],
        ['default', '$default$'],
        ['some_0ther$safe_package', 'some_0ther$safe_package'],
        ['0123simple0123other', '$0123simple0123other$'],
        ['other-folder.asdasd', '$other_folder_asdasd$LQ$$_Lg$$'],
        ['many_§ymb0l$_ìn-folder', '$many__ymb0l$__n_folder$wqc$_w6w$_LQ$$'],
        ['0123and-symbols', '$0123and_symbols$LQ$$'],
    ])('getSafeIdentifier %s', (identifier, expectedEscape) => {
        expect(JavaKeywords.getSafeIdentifier(identifier)).toBe(expectedEscape)
    })
})