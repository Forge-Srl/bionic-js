const t = require('../../../common')

describe('SwiftMethodGenerator', () => {

    let swiftMethodGeneratorPath, SwiftMethodGenerator, CodeBlock

    beforeEach(() => {

        swiftMethodGeneratorPath = 'generation/host/swift/SwiftMethodGenerator'
        SwiftMethodGenerator = t.requireModule(swiftMethodGeneratorPath)
        CodeBlock = t.requireModule('generation/code/CodeBlock')
    })

    test('getImplementation', () => {
        t.resetModulesCache()

        class CodeMock {
            constructor() {
                this.code = 'mock:'
            }

            append(code) {
                this.code += code
                return this
            }

            newLineIndenting() {
                this.code += '\n\t'
                return this
            }

            getString() {
                return this.code
            }
        }

        const CodeBlock = t.mockAndRequireModule('generation/code/CodeBlock')
        CodeBlock.create = t.mockReturnValueOnce(new CodeMock())

        const SwiftMethodGenerator = t.requireModule(swiftMethodGeneratorPath)
        const generator = new SwiftMethodGenerator()
        generator.appendHeader = code => code.append('<header>')
        generator.appendBody = code => code.append('<body>')
        generator.appendFooter = code => code.append('<footer>')

        expect(generator.getImplementation()).toEqual('mock:<header>\n\t<body><footer>')
    })


    describe('appendHeader', () => {
        const appendHeaderExpectations = [
            {
                isOverriding: false, isStatic: false, parametersImpl: [], returnTypeImpl: '',
                expectedHeader: 'func methodName() {',
            }, {
                isOverriding: true, isStatic: false, parametersImpl: [], returnTypeImpl: '',
                expectedHeader: 'override func methodName() {',
            }, {
                isOverriding: false, isStatic: true, parametersImpl: [], returnTypeImpl: '',
                expectedHeader: 'class func methodName() {',
            }, {
                isOverriding: true, isStatic: true, parametersImpl: [], returnTypeImpl: '',
                expectedHeader: 'override class func methodName() {',
            }, {
                isOverriding: false, isStatic: false, parametersImpl: ['par1_stat', 'par2_stat'],
                returnTypeImpl: ' -> return_impl',
                expectedHeader: 'func methodName(par1_stat, par2_stat) -> return_impl {',
            }]

        for (const exp of appendHeaderExpectations) {
            test(exp.expectedHeader, () => {
                const generator = new SwiftMethodGenerator({
                    name: 'methodName',
                    isOverriding: exp.isOverriding,
                    isStatic: exp.isStatic,
                    parameters: exp.parametersImpl.map(s => ({getSwiftGenerator: () => ({getParameterStatement: () => s})})),
                    returnType: {getSwiftGenerator: () => ({getMethodReturnSignature: () => exp.returnTypeImpl})},
                })
                const block = CodeBlock.create()
                generator.appendHeader(block)

                t.expectCode(block, exp.expectedHeader)
            })
        }
    })
})