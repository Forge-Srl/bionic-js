const t = require('../../test-utils')

describe('SwiftHostEnvironmentFileGenerator', () => {

    let SwiftHostEnvironmentFileGenerator, expectedHeader, expectedFooter

    beforeEach(() => {
        SwiftHostEnvironmentFileGenerator =
            t.requireModule('generation/swift/SwiftHostEnvironmentFileGenerator').SwiftHostEnvironmentFileGenerator

        expectedHeader = [
            'import Bjs',
            '',
            'class BjsEnvironment {',
            '    ',
            '    static func initialize() {',
            '        Bjs.setBundle(BjsEnvironment.self, "pkgName")',
        ]

        expectedFooter = [
            '    }',
            '}',
        ]
    })

    function getSourceCode(nativePackageFilesNames) {
        const nativePackageFiles = nativePackageFilesNames.map(name => ({schema: {name}}))
        return new SwiftHostEnvironmentFileGenerator('pkgName', nativePackageFiles).getSource()
    }

    test('getSource, no package native files', () => {
        const code = getSourceCode([])

        t.expectCode(code,
            ...expectedHeader,
            ...expectedFooter)
    })

    test('getSource, with package native files', () => {
        const code = getSourceCode(['NativeClass1', 'NativeClass2'])

        t.expectCode(code,
            ...expectedHeader,
            '        Bjs.get.addNativeWrapper(NativeClass1Wrapper.self)',
            '        Bjs.get.addNativeWrapper(NativeClass2Wrapper.self)',
            ...expectedFooter)
    })
})