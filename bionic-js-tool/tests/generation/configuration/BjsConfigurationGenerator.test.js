const t = require('../../test-utils')

describe('BjsConfigurationGenerator', () => {

    let BjsConfigurationGenerator

    beforeEach(() => {
        BjsConfigurationGenerator = t.requireModule('generation/configuration/BjsConfigurationGenerator').BjsConfigurationGenerator
    })

    test('Full configuration', () => {
        const generator = new BjsConfigurationGenerator({
            projectName: 'MyTestProject',
            guestDirPath: './myGuest/JsPath',
            outputMode: 'development',
            guestBundles: {
                MyFirstBundle: {
                    entryPaths: ['./HelloWorld'],
                },
                OtherBundle: {
                    entryPaths: ['./Other', './inner/other'],
                },
            },
            hostProjects: [{
                language: 'swift',
                projectPath: './swift/HelloJsWorld.xcodeproj',
                hostDirName: 'Generated',
                targetBundles: {
                    MyFirstBundle: {
                        compileTargets: ['target 1']
                    },
                    OtherBundle: {
                        compileTargets: ['target 2 (macOS)', 'target 2 (iOS)']
                    },
                },
            }, {
                language: 'java',
                projectPath: './java',
                srcDirName: 'src_folder',
                basePackage: 'my.test.project',
                hostPackage: 'generated',
                nativePackage: '$native$',
                targetBundles: {
                    MyFirstBundle: {
                        sourceSets: ['myfirstbundle']
                    },
                    OtherBundle: {
                        sourceSets: ['otherbundle-debug', 'otherbundle-release']
                    },
                },
            }],
        })

        t.expectCode(generator.getCode(),
            'const path = require(\'path\')',
            'const resolve = p => path.resolve(__dirname, p)',
            '',
            'module.exports = {',
            '    projectName: \'MyTestProject\',',
            '    guestDirPath: resolve(\'./myGuest/JsPath\'),',
            '    guestBundles: {',
            '        MyFirstBundle: {',
            '            entryPaths: [\'./HelloWorld\'],',
            '        },',
            '        OtherBundle: {',
            '            entryPaths: [\'./Other\', \'./inner/other\'],',
            '        },',
            '    },',
            '    outputMode: \'development\',',
            '    hostProjects: [{',
            '        language: \'swift\',',
            '        projectPath: resolve(\'./swift/HelloJsWorld.xcodeproj\'),',
            '        hostDirName: \'Generated\',',
            '        targetBundles: {',
            '            MyFirstBundle: {',
            '                compileTargets: [\'target 1\'],',
            '            },',
            '            OtherBundle: {',
            '                compileTargets: [\'target 2 (macOS)\', \'target 2 (iOS)\'],',
            '            },',
            '        },',
            '    }, {',
            '        language: \'java\',',
            '        projectPath: resolve(\'./java\'),',
            '        srcDirName: \'src_folder\',',
            '        basePackage: \'my.test.project\',',
            '        hostPackage: \'generated\',',
            '        nativePackage: \'$native$\',',
            '        targetBundles: {',
            '            MyFirstBundle: {',
            '                sourceSets: [\'myfirstbundle\'],',
            '            },',
            '            OtherBundle: {',
            '                sourceSets: [\'otherbundle-debug\', \'otherbundle-release\'],',
            '            },',
            '        },',
            '    }],',
            '}')
    })
})