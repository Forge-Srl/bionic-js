const t = require('../test-utils')

describe('BjsInit smoke tests', () => {

    let BjsInit, Log, Directory, BjsConfiguration

    beforeEach(() => {
        BjsInit = t.requireModule('filesystem/BjsInit').BjsInit
        Log = t.requireModule('filesystem/Log').Log
        Directory = t.requireModule('filesystem/Directory').Directory
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
    })

    const getConfigurationFile = (fileName) => new Directory(__dirname).getSubFile(`../../testing-code/configuration/${fileName}`)

    async function doSmokeTest(configuration, expectedFileName, expectedErrors, expectedWarnings, expectedInfos) {
        await Directory.runInTempDir(async tempDir => {

            const actualConfigFile = tempDir.getSubFile('temp.bjsconfig.js')
            const actualConfigAbsolutePath = actualConfigFile.absolutePath

            const log = new Log(true)
            const bjsInit = new BjsInit(log)
            await bjsInit.init(actualConfigAbsolutePath, configuration)

            t.expectLog(log.errorLog, expectedErrors)
            t.expectLog(log.warningLog, expectedWarnings)
            t.expectLog(log.infoLog, expectedInfos)

            await t.expectFilesAreEqualOrNotExistent(actualConfigFile, getConfigurationFile(expectedFileName))
            expect(() => BjsConfiguration.fromPath(actualConfigAbsolutePath)).not.toThrowError()
        })
    }

    test('Create simple configuration file', async () => {
        const configuration = {
            projectName: 'SimpleProject',
            guestDirPath: './guest/path',
            outputMode: 'production',
            guestBundles: {
                SimpleCore: {
                    entryPaths: ['./SimpleEntryPoint'],
                },
            },
            hostProjects: [{
                language: 'swift',
                projectPath: './ios/SimpleProject.xcodeproj',
                hostDirName: 'SimpleHostProject/host',
                targetBundles: {
                    SimpleCore: {
                        compileTargets: ['SimpleCoreTarget'],
                    },
                },
            }, {
                language: 'java',
                projectPath: './java/SimpleProject',
                srcDirName: 'src',
                basePackage: 'com.simple.project',
                hostPackage: 'host',
                nativePackage: 'nativeComponents',
                targetBundles: {
                    SimpleCore: {
                        sourceSets: ['simplecore'],
                    },
                }
            }],
        }

        await doSmokeTest(configuration, 'simple.bjsconfig.js',
            [''],
            [''],
            [
                '',
                /The following configuration will be written at .+:/,
                'const path = require(\'path\')',
                'const resolve = p => path.resolve(__dirname, p)',
                '',
                'module.exports = {',
                '    projectName: \'SimpleProject\',',
                '    guestDirPath: resolve(\'./guest/path\'),',
                '    guestBundles: {',
                '        SimpleCore: {',
                '            entryPaths: [\'./SimpleEntryPoint\'],',
                '        },',
                '    },',
                '    outputMode: \'production\',',
                '    hostProjects: [{',
                '        language: \'swift\',',
                '        projectPath: resolve(\'./ios/SimpleProject.xcodeproj\'),',
                '        hostDirName: \'SimpleHostProject/host\',',
                '        targetBundles: {',
                '            SimpleCore: {',
                '                compileTargets: [\'SimpleCoreTarget\'],',
                '            },',
                '        },',
                '    }, {',
                '        language: \'java\',',
                '        projectPath: resolve(\'./java/SimpleProject\'),',
                '        srcDirName: \'src\',',
                '        basePackage: \'com.simple.project\',',
                '        hostPackage: \'host\',',
                '        nativePackage: \'nativeComponents\',',
                '        targetBundles: {',
                '            SimpleCore: {',
                '                sourceSets: [\'simplecore\'],',
                '            },',
                '        },',
                '    }],',
                '}',
                '',
            ])
    })
})