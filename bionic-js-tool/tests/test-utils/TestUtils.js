const path = require('path')

class TestUtils {

    static get fsRoot() {
        return path.parse(process.cwd()).root.split(path.sep).join(path.posix.sep)
    }

    static getModuleAbsolutePath(relativePath) {
        const codeDir = '../../'
        return path.resolve(__dirname, codeDir, relativePath)
    }

    static resetModulesCache() {
        jest.resetModules()
    }

    static requireModule(relativePath) {
        const absolutePath = this.getModuleAbsolutePath(relativePath)
        jest.unmock(absolutePath)
        return require(absolutePath)
    }

    static unmockModule(relativePath) {
        const absolutePath = this.getModuleAbsolutePath(relativePath)
        jest.unmock(absolutePath)
    }

    static mockAndRequireModule(relativePath) {
        const absolutePath = this.getModuleAbsolutePath(relativePath)
        return this.mockAndRequire(absolutePath)
    }

    static mockAndRequireFakeModule(relativePath, moduleName, moduleExport) {
        const absolutePath = this.getModuleAbsolutePath(relativePath)
        const mockComponent = {[moduleName]: moduleExport}
        jest.mock(absolutePath, () => mockComponent, {virtual: true})
        return require(absolutePath)
    }

    static mockAndRequire(request) {
        jest.mock(request)
        return require(request)
    }

    static mockGetter(obj, getterName, mockFunction) {
        const jestMockFunction = this.mockFn(mockFunction)
        obj[`${getterName}_get`] = jestMockFunction
        Object.defineProperty(obj, getterName, {get: jestMockFunction})
    }

    static mockReturnValueOnce(returnValue) {
        return this.mockFn().mockReturnValueOnce(returnValue)
    }

    static mockFn(...params) {
        return jest.fn(...params)
    }

    static expectCode(codeBlock, ...expectedLines) {
        const expectedCode = expectedLines.join('\n')
        expect(codeBlock.getString !== undefined ? codeBlock.getString() : codeBlock).toBe(expectedCode)
    }

    static expectLog(actualLogString, expectedLog) {
        const actualRows = actualLogString.split('\n')
        const errors = []

        for (let rowId = 0; rowId < expectedLog.length; rowId++) {
            const expectedRow = expectedLog[rowId]
            if (rowId >= actualRows.length) {
                errors.push(`Expected log row "${expectedRow}" not found in actual logs`)
                break
            }
            const actualRow = actualRows[rowId]
            if (expectedRow instanceof RegExp ? !expectedRow.test(actualRow) : expectedRow !== actualRow) {
                errors.push(`Log row(${rowId}) "${actualRow}" doesn't match with expected row: "${expectedRow}"`)
            }
        }
        if (actualRows.length > expectedLog.length) {
            errors.push('Actual log rows exceed expected rows')
        }
        if (errors.length > 0) {
            throw new Error(errors.join('\n'))
        }
    }

    static async expectFilesAreEqualOrNotExistent(actualFile, expectedFile) {
        const expectedExists = await expectedFile.exists()
        const actualExists = await actualFile.exists()
        if (expectedExists && !actualExists) {
            throw new Error(`${actualFile.absolutePath} should exist but it does not.`)
        } else if (!expectedExists && actualExists) {
            throw new Error(`${actualFile.absolutePath} should not exist but it does.`)
        }

        if (!expectedExists || !actualExists) return

        const expectedContent = await expectedFile.getCodeContent()
        const actualContent = await actualFile.getCodeContent()
        await expect(actualContent).toEqual(expectedContent)
    }
}

module.exports = {TestUtils}