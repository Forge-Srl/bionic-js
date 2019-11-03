const t = require('../test-utils')
const copydir = require('copy-dir')
const {hostFilePaths, packageFilePaths, forbiddenPackageFilePaths} = require('../../testing-code/swift/files')

describe('Bjs smoke tests', () => {

    let BjsSync, DebugLog, Configuration, Directory

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
        Configuration = t.requireModule('filesystem/Configuration').Configuration
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    const getProjectDir = projectName => new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectName}`)
    const getGuestDir = () => new Directory(__dirname).getSubDir('../../testing-code/guest')

    const doSmokeTest = async startProjectName => {

        await Directory.runInTempDir(async tempDir => {

            const startProjectDir = getProjectDir(startProjectName)
            copydir.sync(startProjectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = Configuration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostTargets[0].xcodeProjectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const debugLog = new DebugLog()
            const bjsSync = new BjsSync(configuration, debugLog)
            await bjsSync.sync()

            expect(debugLog.errorLog).toBe('')

            expect(debugLog.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')

            expect(debugLog.infoLog.split('\n')).toEqual(expect.arrayContaining([
                'Processing guest files',
                ' Extracting schemas from guest files...',
                ' ...done',
                `Processing host files dir "${tempDir.absolutePath}/HostProject/host"`,
                ' Deleting files',
                ' Generating host files...',
                '  FerrariCalifornia.swift',
                '  TeslaRoadster.swift',
                '  native/EngineWrapper.swift',
                '  libs/MotorVehicle.swift',
                '  libs/Vehicle.swift',
                ' ...done',
                `Processing package files dir "${tempDir.absolutePath}/HostProject/host/package.bundle"`,
                ' Generating package files...',
                '  FerrariCalifornia.js',
                '  TeslaRoadster.js',
                '  native/Engine.js',
                '  libs/MotorVehicle.js',
                '  libs/Vehicle.js',
                ' ...done']))

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
                let newVar = await guestFile.exists()
                let newVar2 = await forbiddenPackageFile.exists()
                console.log(forbiddenPackageFile.path)
                expect(newVar).toBe(true)
                expect(newVar2).toBe(false)
            }
        })
    }

    test('Fill an empty project', async () => {
        await doSmokeTest('project-without-host')
    })

    test('Update existing files', async () => {
        await doSmokeTest('project-with-host-files')
    })
})