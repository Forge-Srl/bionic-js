const t = require('../test-utils')

describe('BjsNativeObjectPackageFile', () => {

    let BjsNativeObjectPackageFile

    beforeEach(() => {
        BjsNativeObjectPackageFile = t.requireModule('filesystem/BjsNativeObjectPackageFile').BjsNativeObjectPackageFile
    })

    test('build', async () => {
        const targetConfig = {
            packageDirPath: '/packageDir/path',
        }
        const packageFile = BjsNativeObjectPackageFile.build(targetConfig)
        expect(packageFile.path).toBe('/packageDir/path/BjsNativeObject.js')
        expect(packageFile.rootDirPath).toBe('/packageDir/path')
    })

    test('generate', async () => {
        const packageFile = new BjsNativeObjectPackageFile()
        t.mockGetter(packageFile, 'relativePath', () => '/relative/path')

        const hostProject = {
            setPackageFileContent: t.mockFn(async (pathRelativeToPackageDir, packageFileContent) => {

                expect(pathRelativeToPackageDir).toBe('/relative/path')
                t.expectCode(packageFileContent,
                    'class BjsNativeObject {',
                    '',
                    '    constructor(...params) {',
                    '        this.constructor.bjsNative.bjsBind(this, ...params)',
                    '    }',
                    '}',
                    '',
                    'module.exports = {BjsNativeObject}')
            }),
        }

        await packageFile.generate(hostProject)
        expect(hostProject.setPackageFileContent).toBeCalled()
    })
})