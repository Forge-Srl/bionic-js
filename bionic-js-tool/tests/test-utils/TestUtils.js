const path = require('path')

class TestUtils {

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

    static expectCode(codeBlock, ...expectedLines) {
        const expectedCode = expectedLines.join('\n')
        expect(codeBlock.getString !== undefined ? codeBlock.getString() : codeBlock).toBe(expectedCode)
    }

    static mockFn(...params) {
        return jest.fn(...params)
    }
}

module.exports = {TestUtils}