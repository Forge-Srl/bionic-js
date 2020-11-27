const path = require('path')
const {JSON_FILE_EXT, JS_FILE_EXT, MJS_FILE_EXT} = require('./fileExtensions')
const {Webpack} = require('./Webpack')
const {FileWalker} = require('./FileWalker')
const {PackageSourceFile} = require('./PackageSourceFile')
const {SourceFile} = require('./SourceFile')
const {BjsNativeObjectSourceFile} = require('./BjsNativeObjectSourceFile')
const {BjsIndexSourceFile} = require('./BjsIndexSourceFile')

class GuestBundler {

    static build(annotatedFiles, config) {
        return new GuestBundler(annotatedFiles, config.guestDirPath, config.outputMode)
    }

    constructor(annotatedFiles, guestDirPath, outputMode) {
        Object.assign(this, {annotatedFiles, guestDirPath, outputMode})
    }

    get inputFs() {
        if (!this._inputFs) {
            this._inputFs = Webpack.getVirtualFs()
        }
        return this._inputFs
    }

    getWebpack(entryPaths, outputFs) {
        return new Webpack({
            mode: this.outputMode,
            context: this.guestDirPath,
            entry: entryPaths,
            output: {
                path: '/',
                filename: '[name].bundle.js',
            },
        }, outputFs, this.inputFs)
    }

    async saveSourceFile(sourceFile) {
        const data = new Uint8Array(Buffer.from(await sourceFile.getSourceFileContent()))
        try {
            const sourceFileDir = path.parse(sourceFile.path).dir
            await this.inputFs.promises.mkdir(sourceFileDir, {recursive: true})
            await this.inputFs.promises.writeFile(sourceFile.path, data)
        } catch (error) {
            const reason = new Error(`error writing file "${sourceFile.path}" to a virtual filesystem`)
            reason.stack += `\nCaused by:\n` + error.stack
            throw reason
        }
    }

    async generateSourceFiles() {
        const annotatedFilesSet = new Set(this.annotatedFiles.map(annotatedFile => annotatedFile.guestFile.path))
        const packageWalker = new FileWalker(this.guestDirPath, [JSON_FILE_EXT, JS_FILE_EXT, MJS_FILE_EXT].map(ext => `**/*${ext}`))
        const packageFiles = (await packageWalker.getFiles()).filter(packageFile => !annotatedFilesSet.has(packageFile.path))

        const filesToSave = [
            ...this.annotatedFiles.map(annotatedFile => SourceFile.build(annotatedFile)),
            BjsNativeObjectSourceFile.build(this.guestDirPath),
            ...packageFiles.map(packageFile => PackageSourceFile.build(packageFile)),
        ]
        await Promise.all(filesToSave.map(fileToSave => this.saveSourceFile(fileToSave)))

        const bundles = new Set(this.annotatedFiles.flatMap(annotatedFile => annotatedFile.guestFile.bundles))
        const entryPaths = {}
        for (const bundleName of bundles) {
            const indexFile = BjsIndexSourceFile.build(this.annotatedFiles
                    .filter(annotatedFile => annotatedFile.guestFile.bundles.includes(bundleName)),
                bundleName, this.guestDirPath)
            await this.saveSourceFile(indexFile)
            entryPaths[bundleName] = `./${path.basename(indexFile.path)}`
        }
        return entryPaths
    }

    async makeBundles() {
        const entryPaths = await this.generateSourceFiles()
        const outputFs = Webpack.getVirtualFs()
        const compiler = this.getWebpack(entryPaths, outputFs)
        await compiler.compile()
        const bundleNames = Object.getOwnPropertyNames(entryPaths)
        const bundles = await Promise.all(bundleNames.map(async name => (
            {name, content: await outputFs.promises.readFile(`/${name}.bundle.js`, 'utf8')}
        )))
        return bundles
    }
}

module.exports = {GuestBundler}