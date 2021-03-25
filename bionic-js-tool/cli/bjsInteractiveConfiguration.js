const {prompt} = require('enquirer')
const colors = require('ansi-colors')

const printHeader = message => console.log(colors.bold.blue(message))

const bjsInteractiveConfiguration = async () => {
    printHeader('▶ Common project settings\n')

    const baseSettings = await prompt([{
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
    }, {
        type: 'input',
        name: 'guestDirPath',
        message: 'Guest JS code root directory path (relative to configuration file):',
        initial: './js',
    }, {
        type: 'select',
        name: 'outputMode',
        message: 'Choose the output mode:',
        choices: ['development', 'production', 'none'],
    }])

    const guestBundleSettings = await prompt([{
        type: 'input',
        name: 'bundleName',
        message: 'Bundle name:',
    }, {
        type: 'input',
        name: 'entryPath',
        message: `Entry path file for bundle (relative to guest directory path "${baseSettings.guestDirPath}"):`,
        initial: './index',
    }])

    baseSettings.guestBundles = {
        [guestBundleSettings.bundleName]: {
            entryPaths: [guestBundleSettings.entryPath]
        }
    }

    const projects = await prompt({
        type: 'multiselect',
        name: 'selected',
        message: 'Select host projects you want to add:',
        choices: ['Swift', 'Java']
    })

    baseSettings.hostProjects = []
    for (const projectLang of projects.selected) {
        switch (projectLang) {
            case 'Swift':
                baseSettings.hostProjects.push(await interactiveConfigurationSwift(guestBundleSettings.bundleName))
                break

            case 'Java':
                baseSettings.hostProjects.push(await interactiveConfigurationJava(guestBundleSettings.bundleName))
                break

            default:
                throw new Error(`Interactive configuration generation is not available for ${projectLang} host language.`)
        }
    }

    return baseSettings
}

const interactiveConfigurationSwift = async (bundleName) => {
    printHeader('\n▶ Swift host project settings\n')

    const rawSettings = await prompt([{
        type: 'input',
        name: 'projectPath',
        message: 'Path to XCode project file (relative to configuration file):',
    }, {
        type: 'input',
        name: 'hostDirName',
        message: 'Host directory path (relative to XCode project file):',
    }, {
        type: 'input',
        name: 'compileTarget',
        message: `XCode compile target name for "${bundleName}" bundle:`,
    }])

    return {
        language: 'swift',
        projectPath: rawSettings.projectPath,
        hostDirName: rawSettings.hostDirName,
        targetBundles: {
            [bundleName]: {
                compileTargets: [rawSettings.compileTarget]
            }
        }
    }
}

const interactiveConfigurationJava = async (bundleName) => {
    printHeader('\n▶ Java host project settings\n')

    const rawSettings = await prompt([{
        type: 'input',
        name: 'projectPath',
        message: 'Path to Java project root folder (relative to configuration file):',
        initial: './java',
    }, {
        type: 'input',
        name: 'srcDirName',
        message: 'Source directory path (relative to Java project root folder):',
        initial: 'src',
    }, {
        type: 'input',
        name: 'basePackage',
        message: 'Java host project base package:',
    }, {
        type: 'input',
        name: 'hostPackage',
        message: 'Java package name for generated files (without base package):',
    }, {
        type: 'input',
        name: 'nativePackage',
        message: 'Java package name for wrappers implementation (without base package):',
    }, {
        type: 'input',
        name: 'sourceSet',
        message: `Java source set name for "${bundleName}" bundle:`,
    }])

    return {
        language: 'java',
        projectPath: rawSettings.projectPath,
        srcDirName: rawSettings.srcDirName,
        basePackage: rawSettings.basePackage,
        hostPackage: rawSettings.hostPackage,
        nativePackage: rawSettings.nativePackage,
        targetBundles: {
            [bundleName]: {
                sourceSets: [rawSettings.sourceSet]
            }
        }
    }
}

module.exports = {bjsInteractiveConfiguration}