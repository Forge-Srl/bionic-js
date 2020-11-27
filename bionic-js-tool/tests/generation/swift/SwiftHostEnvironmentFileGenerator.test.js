const t = require('../../test-utils')

describe('SwiftHostEnvironmentFileGenerator', () => {

    let SwiftHostEnvironmentFileGenerator, expectedHeader, expectedFooter

    beforeEach(() => {
        SwiftHostEnvironmentFileGenerator =
            t.requireModule('generation/swift/SwiftHostEnvironmentFileGenerator').SwiftHostEnvironmentFileGenerator

        expectedHeader = [
            'import Foundation',
            'import Bjs',
            '',
            '@objc(BjsProject1)',
            'class BjsProject1 : BjsProject {',
            '    ',
            '    override class func initialize(_ bjs: Bjs) {',
            '        bjs.loadBundle(BjsProject1.self, "pkgName")',
        ]

        expectedFooter = [
            '    }',
            '}',
        ]
    })

    function getSourceCode(nativeFilesNames) {
        const nativeFiles = nativeFilesNames.map(name => ({schema: {name}}))
        return new SwiftHostEnvironmentFileGenerator('pkgName', nativeFiles, 'Project1').getSource()
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
            '        bjs.addNativeWrapper(NativeClass1BjsWrapper.self)',
            '        bjs.addNativeWrapper(NativeClass2BjsWrapper.self)',
            ...expectedFooter)
    })
})