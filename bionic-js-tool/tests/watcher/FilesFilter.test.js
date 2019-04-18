const t = require('../test-utils')

describe('FilesFilter', () => {

    let FilesFilter, file

    beforeEach(() => {

        FilesFilter = t.requireModule('watcher/FilesFilter')

        const File = t.requireModule('watcher/File')
        file = new File('/dir1/dir2/dir3/filePath.ext', '/dir1')
    })

    test('ignoreFilter cases', async () => {

        const testCases = [
            {paths: ['filePath.txt'], dirs: [], filtered: false},
            {paths: ['filepath.ext'], dirs: [], filtered: false},
            {paths: [], dirs: ['dir1'], filtered: false},
            {paths: [], dirs: ['dir2/dir4'], filtered: false},
            {paths: ['filePath.ext'], dirs: [], filtered: true},
            {paths: ['*.ext'], dirs: [], filtered: true},
            {paths: ['filePath.*'], dirs: [], filtered: true},
            {paths: [], dirs: ['dir2'], filtered: true},
            {paths: [], dirs: ['dir2/dir3'], filtered: true},
        ]

        for (const testCase of testCases) {
            const filesFilter = new FilesFilter(testCase.paths, testCase.dirs)
            const ignoreFilter = filesFilter.ignoreFilter

            expect(ignoreFilter.ignores(file.relativePath)).toBe(testCase.filtered)
            expect(ignoreFilter).toBe(filesFilter.ignoreFilter)
        }
    })

    test('isToFilter with ignored file', async () => {

        const filesFilter = new FilesFilter()
        const ignores = t.mockFn().mockImplementation(() => true)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(true)
        expect(ignores).toBeCalledWith('dir2/dir3/filePath.ext')
    })

    test('isToFilter with not allowed extension', async () => {

        const filesFilter = new FilesFilter(undefined, undefined, [])
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(true)
        expect(ignores).toBeCalled()
    })

    test('isToFilter with allowed extension', async () => {

        const filesFilter = new FilesFilter(undefined, undefined, ['.ext'])
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(false)
        expect(ignores).toBeCalled()
    })

    test('isToFilter with undefined allowed extensions', async () => {

        const filesFilter = new FilesFilter()
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(false)
        expect(ignores).toBeCalled()
    })
})