const t = require('../test-utils')
const path = require('path')

describe('FileWalker', () => {

    let FileWalker, guestDirPath

    beforeEach(() => {
        FileWalker = t.requireModule('filesystem/FileWalker').FileWalker
        guestDirPath = path.resolve(__dirname, '../../testing-code/guest')
    })

    test('getFiles', async () => {
        const fileWalker = new FileWalker(guestDirPath, ['**/package.json'])
        const files = await fileWalker.getFiles()
        expect(files.map(file => file.relativePath).sort()).toEqual([
            'node_modules/module-a/node_modules/module-c/package.json',
            'node_modules/module-a/package.json',
            'node_modules/module-b/package.json',
            'node_modules/module-c/node_modules/module-b/package.json',
            'node_modules/module-c/node_modules/module-d/package.json',
            'node_modules/module-c/package.json',
            'package.json',
        ])
    })
})