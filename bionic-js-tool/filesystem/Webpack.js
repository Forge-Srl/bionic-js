const webpack = require('webpack')
const {createFsFromVolume, Volume} = require('memfs')

class Webpack {

    static getVirtualFs() {
        return createFsFromVolume(new Volume())
    }

    constructor(webpackConfig, outputFileSystem, inputFileSystem) {
        Object.assign(this, {webpackConfig, outputFileSystem, inputFileSystem})
    }

    get compiler() {
        if (!this._compiler) {
            try {
                let compiler = webpack(this.webpackConfig)
                if (this.outputFileSystem) {
                    compiler = Object.assign(compiler, {outputFileSystem: this.outputFileSystem})
                }
                if (this.inputFileSystem) {
                    compiler = Object.assign(compiler, {inputFileSystem: this.inputFileSystem})
                }
                compiler.intermediateFileSystem = Webpack.getVirtualFs()
                this._compiler = compiler
            } catch (error) {
                error.message = `cannot configure Webpack\n${error.message}`
                throw error
            }
        }
        return this._compiler
    }

    async compile() {
        return new Promise((resolve, reject) => {
            this.compiler.run((err, stats) => {
                if (err) {
                    reject(new Error(`Webpack compiler error: ${err}`))
                    return
                }
                if (stats.hasErrors()) {
                    reject(new Error(`Webpack compiler error:\n${stats.compilation.errors.join('\n')}`))
                    return
                }
                resolve(stats)
            })
        })
    }
}

module.exports = {Webpack}