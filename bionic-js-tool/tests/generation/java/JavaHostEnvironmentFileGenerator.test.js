const t = require('../../test-utils')

describe('JavaHostEnvironmentFileGenerator', () => {

    let JavaHostEnvironmentFileGenerator, expectedHeader, expectedFooter

    beforeEach(() => {
        JavaHostEnvironmentFileGenerator =
            t.requireModule('generation/java/JavaHostEnvironmentFileGenerator').JavaHostEnvironmentFileGenerator

        expectedHeader = [
            'package test.java;',
            '',
            'import bionic.js.Bjs;',
            'import bionic.js.BjsProject;',
            'import bionic.js.BjsProjectTypeInfo;',
            '',
            'public class BjsProject1 extends BjsProject {',
            '    ',
            '    @BjsProjectTypeInfo.Initializer',
            '    public static void initialize(Bjs bjs) {',
            '        initProject();',
            '        bjs.loadBundle(BjsProject1.class, "pkgName");',
        ]

        expectedFooter = [
            '    }',
            '}',
        ]
    })

    function getSourceCode(nativeFilesNames) {
        const nativeFiles = nativeFilesNames.map(name => ({
            schema: {
                name,
                modulePath: `some/path/${name}.java`
            }
        }))
        return new JavaHostEnvironmentFileGenerator('pkgName', nativeFiles, 'Project1', 'test.java').getSource()
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
            '        bjs.addNativeWrapper(test.java.some.path.NativeClass1BjsExport.Wrapper.class);',
            '        bjs.addNativeWrapper(test.java.some.path.NativeClass2BjsExport.Wrapper.class);',
            ...expectedFooter)
    })
})