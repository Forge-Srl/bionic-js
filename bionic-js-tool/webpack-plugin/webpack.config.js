const path = require('path')
const {BionicJsWebpackPlugin} = require('./BionicJsWebpackPlugin')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, './bundle'),
    },
    plugins: [new BionicJsWebpackPlugin()],
}
