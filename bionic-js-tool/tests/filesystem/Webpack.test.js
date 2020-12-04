const t = require('../test-utils')

describe('Webpack', () => {

    let Webpack

    beforeEach(() => {
        Webpack = t.requireModule('filesystem/Webpack').Webpack
    })

    test('compile, configuration error', async () => {
        const webpack = new Webpack({entry: null})
        await expect(webpack.compile()).rejects.toThrow('cannot configure Webpack\nInvalid configuration object.')
    })

    test('compile, compiler error', async () => {
        const virtualFs = Webpack.getVirtualFs()
        await virtualFs.promises.writeFile('/file.js', new Uint8Array(Buffer.from('"syntax error')))
        const webpack = new Webpack({entry: '/file.js'}, null, virtualFs)
        await expect(webpack.compile()).rejects.toThrow('Webpack compiler error:\nModuleParseError: Module parse failed')
    })
})