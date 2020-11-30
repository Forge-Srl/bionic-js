const t = require('../test-utils')
const copydir = require('copy-dir')
const {hostFiles, bundleFiles} = require('../../testing-code/swift/files')

describe('Bjs smoke tests', () => {

    let BjsSync, Log, BjsConfiguration, Directory

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        Log = t.requireModule('filesystem/Log').Log
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    function expectLog(expectedLog, actualLogString) {
        const actualRows = actualLogString.split('\n')
        const errors = []

        for (let rowId = 0; rowId < expectedLog.length; rowId++) {
            const expectedRow = expectedLog[rowId]
            if (rowId >= actualRows.length) {
                errors.push(`Expected log row "${expectedRow}" not found in actual logs`)
                break
            }
            const actualRow = actualRows[rowId]
            if (expectedRow instanceof RegExp ? !expectedRow.test(actualRow) : expectedRow !== actualRow) {
                errors.push(`Log row(${rowId}) "${actualRow}" doesn't match with expected row: "${expectedRow}"`)
            }
        }
        if (actualRows.length > expectedLog.length) {
            errors.push('Actual log rows exceed expected rows')
        }
        if (errors.length > 0) {
            throw Error(errors.join('\n'))
        }
    }

    const getProjectDir = projectName => new Directory(__dirname).getSubDir(`../../testing-code/swift/${projectName}`)

    async function doSmokeTest(startProjectName, expectedErrors, expectedWarnings, expectedInfos) {
        await Directory.runInTempDir(async tempDir => {

            const startProjectDir = getProjectDir(startProjectName)
            copydir.sync(startProjectDir.absolutePath, tempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = BjsConfiguration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostProjects[0].projectPath = tempDir.getSubFile('HostProject.xcodeproj').absolutePath
            const log = new Log(true)
            const bjsSync = new BjsSync(configuration, log)
            await bjsSync.sync()

            expectLog(expectedErrors, log.errorLog)
            expectLog(expectedWarnings, log.warningLog)
            expectLog(expectedInfos, log.infoLog)

            const projectWithFilesDir = getProjectDir('project-with-host-files')
            const hostDir = 'HostProject/host'
            for (const file of [...hostFiles, ...bundleFiles]) {
                const expectedFile = projectWithFilesDir.getSubDir(hostDir).getSubFile(file.path)
                const actualFile = tempDir.getSubDir(hostDir).getSubFile(file.path)
                const expectedContent = await expectedFile.getContent()
                const actualContent = await actualFile.getContent()
                await expect(actualContent).toEqual(expectedContent)
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
                'Bionic.js - v1.0.1',
                '',
                'Analyzing guest files dependencies',
                'Extracting schemas from guest files',
                'Generating bundles',
                'Opening Swift host project',
                'Writing bundles',
                'Writing host files',
                'Writing Swift host project',
                '',
                'Project files',
                ...bundleFiles.map(file => ` [+] Bundle "${file.bundle}"`),
                ...hostFiles.map(file => ` [+] Source "${file.path}" - in bundles (${file.bundles.join(', ')})`),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 12',
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
                'Bionic.js - v1.0.1',
                '',
                'Analyzing guest files dependencies',
                'Extracting schemas from guest files',
                'Generating bundles',
                'Opening Swift host project',
                'Writing bundles',
                'Writing host files',
                'Writing Swift host project',
                '',
                'Project files',
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