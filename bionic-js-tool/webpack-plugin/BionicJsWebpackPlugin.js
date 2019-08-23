const pluginName = 'BionicJsWebpackPlugin'

class BionicJsWebpackPlugin {
    apply(compiler) {
        // Specify the event hook to attach to

        compiler.hooks.compilation.tap(pluginName, (compilation, compilationParams) => {

            compilation.hooks.buildModule.tap(pluginName, module => {
                console.log(module)
            })

            compilation.hooks.succeedModule.tap(pluginName, module => {
                console.log(module)
            })

        })

        // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
        compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
            // Create a header string for the generated file:
            let filelist = 'In this build:\n\n'

            // Loop through all compiled assets,
            // adding a new line item for each filename.
            for (const filename in compilation.assets) {
                filelist += '- ' + filename + '\n'
            }

            // Insert this list into the webpack build as a new file asset:
            compilation.assets['filelist.md'] = {
                source: function () {
                    return filelist
                },
                size: function () {
                    return filelist.length
                },
            }

            callback()
        })
    }
}

module.exports = {BionicJsWebpackPlugin}