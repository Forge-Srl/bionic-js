const t = require('../test-utils')
const copydir = require('copy-dir')
const {hostFilePaths, packageFilePaths, forbiddenPackageFilePaths} = require('../../testing-code/swift/files')

describe('Bjs smoke tests', () => {

    let BjsSync, Log, Configuration, Directory

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        Log = t.requireModule('filesystem/Log').Log
        Configuration = t.requireModule('filesystem/configuration/Configuration').Configuration
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    function expectLog(expectedLog, actualLogString) {
        let actualLog = actualLogString.split('\n')

        for (let a = 0; a < actualLog.length; a++) {
            const actualMsg = actualLog[a]

            const matches = expectedMsg => {
                return expectedMsg instanceof RegExp ? expectedMsg.test(actualMsg) : expectedMsg === actualMsg
            }
            let matching = false
            for (let e = 0; e < expectedLog.length; e++) {
                const expectedMsg = expectedLog[e]

                if (matches(expectedMsg)) {
                    expectedLog = expectedLog.filter((_, index) => index !== e)
                    matching = true
                    break
                }
            }
            if (!matching) {
                throw new Error(`Log row "${actualMsg}" (row ${a}) not found in expected log\nActual log:\n${actualLogString}`)
            }
        }
        if (expectedLog.length) {
            throw new Error(`Expected log messages not logged:\n${expectedLog.join('\n')}\nActual log:\n${actualLogString}`)
        }
    }

    async function expectCode(actualCodeFile, expectedCodeFile) {
        const expectedContent = await expectedCodeFile.getContent()
        const actualContent = await actualCodeFile.getContent()
        expect(actualContent).toEqual(expectedContent)
    }

    const getProjectDir = projectName => new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectName}`)
    const getGuestDir = () => new Directory(__dirname).getSubDir('../../testing-code/guest')

    async function doSmokeTest(startProjectName, expectedErrors, expectedWarnings, expectedInfos) {
        await Directory.runInTempDir(async tempDir => {

            const startProjectDir = getProjectDir(startProjectName)
            copydir.sync(startProjectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = Configuration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostTargets[0].xcodeProjectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const log = new Log(true)
            const bjsSync = new BjsSync(configuration, log)
            await bjsSync.sync()

            expectLog(expectedErrors, log.errorLog)
            expectLog(expectedWarnings, log.warningLog)
            expectLog(expectedInfos, log.infoLog)

            const projectWithFilesDir = getProjectDir('project-with-host-files')
            const hostDir = 'HostProject/host'
            for (const hostFilePath of hostFilePaths) {
                const expectedHostFile = projectWithFilesDir.getSubDir(hostDir).getSubFile(hostFilePath)
                const actualHostFile = tempDir.getSubDir(hostDir).getSubFile(hostFilePath)
                await expectCode(actualHostFile, expectedHostFile)
            }

            const packageDir = 'HostProject/host/package.bundle'
            for (const packageFilePath of packageFilePaths) {
                const expectedPackageFile = projectWithFilesDir.getSubDir(packageDir).getSubFile(packageFilePath)
                const actualPackageFile = tempDir.getSubDir(packageDir).getSubFile(packageFilePath)
                await expectCode(actualPackageFile, expectedPackageFile)
            }

            const guestDir = getGuestDir()
            for (const forbiddenPackageFilePath of forbiddenPackageFilePaths) {
                const guestFile = guestDir.getSubFile(forbiddenPackageFilePath)
                const forbiddenPackageFile = tempDir.getSubDir(packageDir).getSubFile(forbiddenPackageFilePath)
                expect(await guestFile.exists()).toBe(true)
                expect(await forbiddenPackageFile.exists()).toBe(false)
            }
        })
    }

    test('Fill an empty project', async () => {
        await doSmokeTest('project-without-host',
            [
                '',
            ],
            [
                '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped',
                '',
            ],
            [
                'Bionic.js - v0.2.0',
                '',
                'Extracting schemas from guest files...',
                'Opening host project...',
                'Generating host files...',
                'Generating package files...',
                'Generating virtual files...',
                'Saving host project...',
                '',
                'Package files',
                ...packageFilePaths.map(packageFile => ` [+] ${packageFile}`),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 18',
                '',
                'Host files',
                ...hostFilePaths.map(hostFile => ` [+] ${hostFile}`),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 7',
                '',
                /Processing time: \d\.\d\ds/,
                '',
            ])
    })

    test('Update existing files', async () => {
        await doSmokeTest('project-with-host-files',
            [
                '',
            ],
            [
                '',
            ],
            [
                'Bionic.js - v0.2.0',
                '',
                'Extracting schemas from guest files...',
                'Opening host project...',
                'Generating host files...',
                'Generating package files...',
                'Generating virtual files...',
                'Saving host project...',
                '',
                'Package files',
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 0',
                '',
                'Host files',
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 0',
                '',
                /Processing time: \d\.\d\ds/,
                '',
            ])
    })
})