const t = require('../test-utils')

describe('FilesFilter', () => {

    const filePath = '/dir1/dir2/dir3/filePath.ext'
    let FilesFilter, file

    beforeEach(() => {

        FilesFilter = t.requireModule('watcher/FilesFilter').FilesFilter

        const File = t.requireModule('watcher/File').File
        file = new File(filePath, '/dir1')
    })

    describe('ignoreFilter on file ' + filePath, () => {
        const testCases = [
            {paths: [], filtered: false},
            {paths: ['filePath.txt'], filtered: false},
            {paths: ['filepath.ext'], filtered: false},
            {paths: ['filePath.ext'], filtered: true},
            {paths: ['*.ext'], filtered: true},
            {paths: ['filePath.*'], filtered: true},
            {paths: ['dir1/'], filtered: false},
            {paths: ['dir2/'], filtered: true},
            {paths: ['**/dir3'], filtered: true},
            {paths: ['**/dir2'], filtered: true},
            {paths: ['**/dir1'], filtered: false},
        ]

        for (const testCase of testCases) {
            test(`with paths ${testCase.paths.join(', ')}`, () => {

                const filesFilter = new FilesFilter(testCase.paths)
                const ignoreFilter = filesFilter.ignoreFilter

                expect(ignoreFilter.ignores(file.relativePath)).toBe(testCase.filtered)
                expect(ignoreFilter).toBe(filesFilter.ignoreFilter)
            })
        }
    })

    test('isToFilter with ignored file', () => {

        const filesFilter = new FilesFilter()
        const ignores = t.mockFn().mockImplementation(() => true)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(true)
        expect(ignores).toBeCalledWith('dir2/dir3/filePath.ext')
    })

    test('isToFilter with not allowed extension', () => {

        const filesFilter = new FilesFilter(undefined, [])
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(true)
        expect(ignores).toBeCalled()
    })

    test('isToFilter with allowed extension', () => {

        const filesFilter = new FilesFilter(undefined, ['.ext'])
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(false)
        expect(ignores).toBeCalled()
    })

    test('isToFilter with undefined allowed extensions', () => {

        const filesFilter = new FilesFilter()
        const ignores = t.mockFn().mockImplementation(() => false)
        t.mockGetter(filesFilter, 'ignoreFilter', t.mockFn(() => ({ignores})))

        const result = filesFilter.isToFilter(file)

        expect(result).toBe(false)
        expect(ignores).toBeCalled()
    })
})