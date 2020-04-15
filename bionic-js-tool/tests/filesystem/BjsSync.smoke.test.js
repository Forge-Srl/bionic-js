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

    const getProjectDir = projectName => new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectName}`)
    const getGuestDir = () => new Directory(__dirname).getSubDir('../../testing-code/guest')

    const doSmokeTest = async (startProjectName, expectedErrorLog, expectedWarningLog, expectedInfoLines) => {

        await Directory.runInTempDir(async tempDir => {

            const startProjectDir = getProjectDir(startProjectName)
            copydir.sync(startProjectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = Configuration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostTargets[0].xcodeProjectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const log = new Log(true)
            const bjsSync = new BjsSync(configuration, log)
            await bjsSync.sync()

            expect(log.errorLog).toBe(expectedErrorLog)
            expect(log.warningLog).toBe(expectedWarningLog)
            expect(log.infoLog.split('\n').sort()).toEqual(expectedInfoLines.sort())

            const projectWithFilesDir = getProjectDir('project-with-host-files')
            const hostDir = 'HostProject/host'
            for (const hostFilePath of hostFilePaths) {
                const expectedHostFile = projectWithFilesDir.getSubDir(hostDir).getSubFile(hostFilePath)
                const actualHostFile = tempDir.getSubDir(hostDir).getSubFile(hostFilePath)
                expect(await actualHostFile.getContent()).toBe(await expectedHostFile.getContent())
            }

            const packageDir = 'HostProject/host/package.bundle'
            for (const packageFilePath of packageFilePaths) {
                const expectedPackageFile = projectWithFilesDir.getSubDir(packageDir).getSubFile(packageFilePath)
                const actualPackageFile = tempDir.getSubDir(packageDir).getSubFile(packageFilePath)
                expect(await actualPackageFile.getContent()).toBe(await expectedPackageFile.getContent())
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
        await doSmokeTest('project-without-host', '',
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n',
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
                ' [+] added : 17',
                '',
                'Host files',
                ...hostFilePaths.map(hostFile => ` [+] ${hostFile}`),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 6',
                '',
            ])
    })

    test('Update existing files', async () => {
        await doSmokeTest('project-with-host-files', '', '',
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
            ])
    })
})