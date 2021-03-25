const {CodeBlock} = require('../code/CodeBlock')

class BjsConfigurationGenerator {

    static guestBundlesCode(guestBundles) {
        const code = CodeBlock.create()
            .append('{')

        const keys = Object.keys(guestBundles)
        if (keys.length) {
            code.newLineIndenting()
        }

        for (const bundleName of keys) {
            code.append(`${bundleName}: {`).newLineIndenting()
                .append('entryPaths: [').append(guestBundles[bundleName].entryPaths.map(path => `'${path}'`).join(', '))
                .__.append('],').newLineDeindenting()
                .append('},')

            if (bundleName === keys[keys.length - 1]) {
                code.newLineDeindenting()
            } else {
                code.newLine()
            }
        }

        code.append('}')
        return code
    }

    static javaTargetBundlesCode(targetBundles) {
        const code = CodeBlock.create()
            .append('{')

        const keys = Object.keys(targetBundles)
        if (keys.length) {
            code.newLineIndenting()
        }

        for (const bundleName of keys) {
            code.append(`${bundleName}: {`).newLineIndenting()
                .append('sourceSets: [').append(targetBundles[bundleName].sourceSets.map(sourceSet => `'${sourceSet}'`).join(', '))
                .__.append('],').newLineDeindenting()
                .append('},')

            if (bundleName === keys[keys.length - 1]) {
                code.newLineDeindenting()
            } else {
                code.newLine()
            }
        }

        code.append('}')
        return code
    }

    static swiftTargetBundlesCode(targetBundles) {
        const code = CodeBlock.create()
            .append('{')

        const keys = Object.keys(targetBundles)
        if (keys.length) {
            code.newLineIndenting()
        }

        for (const bundleName of keys) {
            code.append(`${bundleName}: {`).newLineIndenting()
                .append('compileTargets: [').append(targetBundles[bundleName].compileTargets.map(target => `'${target}'`).join(', '))
                .__.append('],').newLineDeindenting()
                .append('},')

            if (bundleName === keys[keys.length - 1]) {
                code.newLineDeindenting()
            } else {
                code.newLine()
            }
        }

        code.append('}')
        return code
    }

    static javaHostProjectCode(project) {
        return CodeBlock.create()
            .append('{').newLineIndenting()
            .append('language: \'java\',').newLine()
            .append(`projectPath: resolve('${project.projectPath}'),`).newLine()
            .append(`srcDirName: '${project.srcDirName}',`).newLine()
            .append(`basePackage: '${project.basePackage}',`).newLine()
            .append(`hostPackage: '${project.hostPackage}',`).newLine()
            .append(`nativePackage: '${project.nativePackage}',`).newLine()
            .append('targetBundles: ').append(this.javaTargetBundlesCode(project.targetBundles))
            .__.append(',').newLineDeindenting()
            .append('}')
    }

    static swiftHostProjectCode(project) {
        return CodeBlock.create()
            .append('{').newLineIndenting()
            .append('language: \'swift\',').newLine()
            .append(`projectPath: resolve('${project.projectPath}'),`).newLine()
            .append(`hostDirName: '${project.hostDirName}',`).newLine()
            .append('targetBundles: ').append(this.swiftTargetBundlesCode(project.targetBundles))
            .__.append(',').newLineDeindenting()
            .append('}')
    }

    static hostProjectsCode(hostProjects) {
        const code = CodeBlock.create()
            .append('[')

        hostProjects.forEach((project, index) => {
            switch (project.language) {
                case 'java':
                    code.append(this.javaHostProjectCode(project))
                    break
                case 'swift':
                    code.append(this.swiftHostProjectCode(project))
                    break
            }
            if (index < hostProjects.length - 1) {
                code.append(', ')
            }
        })

        code.append(']')
        return code
    }

    constructor(rawConfiguration) {
        Object.assign(this, {rawConfiguration})
    }

    getCode() {
        const code = CodeBlock.create()
            .append('const path = require(\'path\')').newLine()
            .append('const resolve = p => path.resolve(__dirname, p)').newLine()
            .newLine()
            .append('module.exports = {').newLineIndenting()
            .append(`projectName: '${this.rawConfiguration.projectName}',`).newLine()
            .append(`guestDirPath: resolve('${this.rawConfiguration.guestDirPath}'),`).newLine()
            .append('guestBundles: ').append(this.constructor.guestBundlesCode(this.rawConfiguration.guestBundles))
            .__.append(',').newLine()
            .append(`outputMode: '${this.rawConfiguration.outputMode}',`).newLine()
            .append('hostProjects: ').append(this.constructor.hostProjectsCode(this.rawConfiguration.hostProjects))
            .__.append(',').newLineDeindenting()
            .append('}')

        return code.getString()
    }
}

module.exports = {BjsConfigurationGenerator}