const t = require('../test-utils')
const copydir = require('copy-dir')
const {hostFiles: swiftHostFiles, bundleFiles: swiftBundleFiles} = require('../../testing-code/swift/files')
const {hostFiles: javaHostFiles, bundleFiles: javaBundleFiles} = require('../../testing-code/java/files')

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

    const getProjectDir = (projectName, lang) => new Directory(__dirname).getSubDir(`../../testing-code/${lang}/${projectName}`)

    async function doSmokeTest(bjsSyncCallback, startProjectName, compareWithProject, expectedErrors, expectedWarnings, expectedInfos) {
        await Directory.runInTempDir(async tempDir => {

            const swiftStartProjectDir = getProjectDir(startProjectName, 'swift')
            const swiftTempDir = tempDir.getSubDir('swift')
            copydir.sync(swiftStartProjectDir.absolutePath, swiftTempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const javaStartProjectDir = getProjectDir(startProjectName, 'java')
            const javaTempDir = tempDir.getSubDir('java')
            copydir.sync(javaStartProjectDir.absolutePath, javaTempDir.absolutePath, {utimes: true, mode: true, cover: true})

            const configuration = BjsConfiguration.fromPath(t.getModuleAbsolutePath('testing-code/bjs.config.js'))
            configuration.configObj.hostProjects[0].projectPath = swiftTempDir.getSubFile('HostProject.xcodeproj').absolutePath
            configuration.configObj.hostProjects[1].projectPath = javaTempDir.absolutePath

            const log = new Log(true)
            const bjsSync = new BjsSync(configuration, log)
            await bjsSyncCallback(bjsSync)

            expectLog(expectedErrors, log.errorLog)
            expectLog(expectedWarnings, log.warningLog)
            expectLog(expectedInfos, log.infoLog)

            await checkSwiftFiles(swiftTempDir, getProjectDir(compareWithProject, 'swift'))
            await checkJavaFiles(javaTempDir, getProjectDir(compareWithProject, 'java'))
        })
    }

    async function checkSwiftFiles(actualSwiftDir, expectedSwiftDir) {
        const hostDir = 'HostProject/host'

        for (const file of [...swiftHostFiles, ...swiftBundleFiles]) {
            const expectedFile = expectedSwiftDir.getSubDir(hostDir).getSubFile(file.path)
            const actualFile = actualSwiftDir.getSubDir(hostDir).getSubFile(file.path)
            await filesAreEqualOrNotExistent(expectedFile, actualFile)
        }
    }

    async function checkJavaFiles(actualJavaDir, expectedJavaDir) {
        const hostDir = sourceSet => `HostProject/src/${sourceSet}/java/test/project/host`

        for (const file of javaHostFiles) {
            for (const sourceSet of file.sourceSets) {
                const expectedFile = expectedJavaDir.getSubDir(hostDir(sourceSet)).getSubFile(file.path)
                const actualFile = actualJavaDir.getSubDir(hostDir(sourceSet)).getSubFile(file.path)
                await filesAreEqualOrNotExistent(expectedFile, actualFile)
            }
        }

        const bundleDir = sourceSet => `HostProject/src/${sourceSet}/resources`
        for (const file of javaBundleFiles) {
            for (const sourceSet of file.sourceSets) {
                const expectedFile = expectedJavaDir.getSubDir(bundleDir(sourceSet)).getSubFile(file.path)
                const actualFile = actualJavaDir.getSubDir(bundleDir(sourceSet)).getSubFile(file.path)
                await filesAreEqualOrNotExistent(expectedFile, actualFile)
            }
        }
    }

    async function filesAreEqualOrNotExistent(expectedFile, actualFile) {
        const expectedExists = await expectedFile.exists()
        const actualExists = await actualFile.exists()
        if (expectedExists && !actualExists) {
            throw new Error(`${actualFile.absolutePath} should exist but it does not.`)
        } else if (!expectedExists && actualExists) {
            throw new Error(`${actualFile.absolutePath} should not exist but it does.`)
        }

        if (!expectedExists || !actualExists) return

        const expectedContent = await expectedFile.getCodeContent()
        const actualContent = await actualFile.getCodeContent()
        await expect(actualContent).toEqual(expectedContent)
    }

    test('Fill an empty project', async () => {
        const projectFilesOrder = (text1, text2) => text1 < text2 ? -1 : text1 > text2 ? 1 : 0

        await doSmokeTest(async bjsSync => await bjsSync.sync(),
            'project-without-host',
            'project-with-host-files',
            [
                '',
            ],
            [
                '"Project/HostProject/Group1/WrongLocationGroup": file location attribute is not "Relative to Group", this config is not supported so the file will be skipped',
                '',
            ],
            [
                'Analyzing guest files dependencies',
                'Extracting schemas from guest files',
                'Generating bundles',
                '',
                'Opening Swift host project',
                'Writing bundles',
                'Writing host files',
                'Writing Swift host project',
                '',
                'Project files',
                ...swiftBundleFiles.map(file => ` [+] Bundle "${file.bundle}"`),
                ...(swiftHostFiles.map(file => ` [+] Source "${file.path}" - in bundles (${file.bundles.join(', ')})`)).sort(projectFilesOrder),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 12',
                '',
                'Opening Java host project',
                'Writing bundles',
                'Writing host files',
                'Writing Java host project',
                '',
                'Project files',
                ...javaBundleFiles.map(file => ` [+] Bundle "${file.bundle}"`),
                ...(javaHostFiles.flatMap(file => file.path === 'BjsBeautifulVehicles.java' ? file.sourceSets.map(s => file) : [file])
                    .map(file => ` [+] Source "${file.path}" - in bundles (${file.bundles.join(', ')})`)).sort(projectFilesOrder),
                ' ----------',
                ' [-] deleted : 0',
                ' [U] updated : 0',
                ' [+] added : 13',
                '',
                /Processing time: \d\.\d\ds/,
                '',
            ])
    })

    test('Update existing files', async () => {
        await doSmokeTest(async bjsSync => await bjsSync.sync(),
            'project-with-host-files',
            'project-with-host-files',
            [
                '',
            ],
            [
                '',
            ],
            [
                'Analyzing guest files dependencies',
                'Extracting schemas from guest files',
                'Generating bundles',
                '',
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
                'Opening Java host project',
                'Writing bundles',
                'Writing host files',
                'Writing Java host project',
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

    test('Clean existing files', async () => {
        const projectFilesOrder = (text1, text2) => text1 < text2 ? -1 : text1 > text2 ? 1 : 0

        await doSmokeTest(async bjsSync => await bjsSync.clean(),
            'project-with-host-files',
            'project-without-host',
            [
                '',
            ],
            [
                '',
            ],
            [
                '',
                'Opening Swift host project',
                'Writing bundles',
                'Writing host files',
                'Writing Swift host project',
                '',
                'Project files',
                ...swiftBundleFiles.map(file => ` [-] Bundle "${file.bundle}"`),
                ...(swiftHostFiles.map(file => ` [-] Source "${file.path}" - in bundles (${file.bundles.join(', ')})`)).sort(projectFilesOrder),
                ' ----------',
                ' [-] deleted : 12',
                ' [U] updated : 0',
                ' [+] added : 0',
                '',
                'Opening Java host project',
                'Writing bundles',
                'Writing host files',
                'Writing Java host project',
                '',
                'Project files',
                ...javaBundleFiles.map(file => ` [-] Bundle "${file.bundle}"`),
                ...(javaHostFiles.flatMap(file => file.path === 'BjsBeautifulVehicles.java' ? file.sourceSets.map(s => file) : [file])
                    .map(file => ` [-] Source "${file.path}" - in bundles (${file.bundles.join(', ')})`)).sort(projectFilesOrder),
                ' ----------',
                ' [-] deleted : 13',
                ' [U] updated : 0',
                ' [+] added : 0',
                '',
                /Processing time: \d\.\d\ds/,
                '',
            ])
    })
})