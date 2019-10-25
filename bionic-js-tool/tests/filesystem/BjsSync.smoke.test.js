const t = require('../test-utils')
const copydir = require('copy-dir')

describe('Bjs smoke tests', () => {

    let BjsSync, DebugLog, Configuration, Directory

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
        Configuration = t.requireModule('filesystem/Configuration').Configuration
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    const checkDebugLog = (debugLog, tempDir) => {
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

        // TODO: do not log the same warning multiple times
        expect(debugLog.warningLog).toBe('"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n' +
            '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped\n')
        expect(debugLog.errorLog).toBe('')
    }

    test('Run without errors - empty project', async () => {
        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/project-without-host`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = Configuration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostTargets[0].xcodeProjectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const debugLog = new DebugLog()
            const bjsSync = new BjsSync(configuration, debugLog)
            await bjsSync.sync()

            checkDebugLog(debugLog, tempDir)
        })
    })

    test('Run without errors - update existing files', async () => {
        await Directory.runInTempDir(async tempDir => {
            const projectDir = new Directory(__dirname).getSubDir(`../../testing-code/swift/project-with-host-files`)
            copydir.sync(projectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = Configuration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostTargets[0].xcodeProjectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const debugLog = new DebugLog()
            const bjsSync = new BjsSync(configuration, debugLog)
            await bjsSync.sync()

            checkDebugLog(debugLog, tempDir)
        })
    })
})