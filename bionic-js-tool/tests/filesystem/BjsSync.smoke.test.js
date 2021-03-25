const t = require('../test-utils')
const copydir = require('copy-dir')
const {hostFiles: swiftHostFiles, bundleFiles: swiftBundleFiles} = require('../../testing-code/swift/files')
const {hostFiles: javaHostFiles, bundleFiles: javaBundleFiles} = require('../../testing-code/java/files')

describe('BjsSync smoke tests', () => {

    let BjsSync, Log, BjsConfiguration, Directory

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        Log = t.requireModule('filesystem/Log').Log
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    const getProjectDir = (projectName, lang) => new Directory(__dirname).getSubDir(`../../testing-code/${lang}/${projectName}`)
    const projectFilesOrder = (text1, text2) => text1 < text2 ? -1 : text1 > text2 ? 1 : 0

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

            t.expectLog(log.errorLog, expectedErrors)
            t.expectLog(log.warningLog, expectedWarnings)
            t.expectLog(log.infoLog, expectedInfos)

            await checkSwiftFiles(swiftTempDir, getProjectDir(compareWithProject, 'swift'))
            await checkJavaFiles(javaTempDir, getProjectDir(compareWithProject, 'java'))
        })
    }

    async function checkSwiftFiles(actualSwiftDir, expectedSwiftDir) {
        const hostDir = 'HostProject/host'

        for (const file of [...swiftHostFiles, ...swiftBundleFiles]) {
            const expectedFile = expectedSwiftDir.getSubDir(hostDir).getSubFile(file.path)
            const actualFile = actualSwiftDir.getSubDir(hostDir).getSubFile(file.path)
            await t.expectFilesAreEqualOrNotExistent(actualFile, expectedFile)
        }
    }

    async function checkJavaFiles(actualJavaDir, expectedJavaDir) {
        const hostDir = sourceSet => `HostProject/src/${sourceSet}/java/test/project/host`

        for (const file of javaHostFiles) {
            for (const sourceSet of file.sourceSets) {
                const expectedFile = expectedJavaDir.getSubDir(hostDir(sourceSet)).getSubFile(file.path)
                const actualFile = actualJavaDir.getSubDir(hostDir(sourceSet)).getSubFile(file.path)
                await t.expectFilesAreEqualOrNotExistent(actualFile, expectedFile)
            }
        }

        const bundleDir = sourceSet => `HostProject/src/${sourceSet}/resources`
        for (const file of javaBundleFiles) {
            for (const sourceSet of file.sourceSets) {
                const expectedFile = expectedJavaDir.getSubDir(bundleDir(sourceSet)).getSubFile(file.path)
                const actualFile = actualJavaDir.getSubDir(bundleDir(sourceSet)).getSubFile(file.path)
                await t.expectFilesAreEqualOrNotExistent(actualFile, expectedFile)
            }
        }
    }

    test('Fill an empty project', async () => {
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