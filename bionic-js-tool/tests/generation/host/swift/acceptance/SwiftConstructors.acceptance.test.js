const t = require('../../../../test-utils')

describe('Swift constructors acceptance', () => {

    let Class, Constructor, Parameter, VoidType, IntType, LambdaType, expectedHeader, expectedFooter

    function getClassCode(classObj) {
        return classObj.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Constructor = t.requireModule('schema/Constructor')
        Parameter = t.requireModule('schema/Parameter')
        VoidType = t.requireModule('schema/types/VoidType')
        IntType = t.requireModule('schema/types/IntType')
        LambdaType = t.requireModule('schema/types/LambdaType')

        expectedHeader = [
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: BjsClass {',
            '    ']

        expectedFooter = [
            '    ',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    class var bjsModulePath: String {',
            '        return ""',
            '    }',
            '}']
    })

    test('class with constructor no args', () => {
        const class1 = new Class('Class1', '', [new Constructor('', [])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init() {',
            '        self.init(Class1.bjsClass, [])',
            '    }',
            ...expectedFooter)
    })

    test('class with constructor and primitive arg', () => {
        const parameter = new Parameter(new IntType(), 'parameter', '')

        const class1 = new Class('Class1', '', [new Constructor('', [parameter])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init(_ parameter: Int?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putPrimitive(parameter)])',
            '    }',
            ...expectedFooter)
    })

    test('class with constructor and lambda arg', () => {
        const parameter = new Parameter(new LambdaType(new VoidType(), []), 'nativeFunc', '')

        const class1 = new Class('Class1', '', [new Constructor('', [parameter])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init(_ nativeFunc: (() -> Void)?) {',
            '        let __func: @convention(block) () -> Void = {',
            '            _ = nativeFunc!()',
            '        }',
            '    self.init(Class1.bjsClass, [Bjs.get.putFunc(nativeFunc, __func)])',
            '    }',
            ...expectedFooter)
    })

    test('class with constructor and args', () => {
        const nativeFunc1 = new Parameter(new LambdaType(new VoidType(), []), 'nativeFunc1', '')
        const nativeFunc2 = new Parameter(new LambdaType(new IntType(), []), 'nativeFunc2', '')
        const intPar = new Parameter(new IntType(), 'intPar', '')

        const class1 = new Class('Class1', '', [new Constructor('', [nativeFunc1, nativeFunc2, intPar])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            ...expectedHeader,
            '    convenience init(_ parameter1: ParameterType?, _ parameter2: Int?) {',
            '        self.init(Class1.bjsClass, [Bjs.get.putObj(firstParameter), secondParameter])',
            '    }',
            ...expectedFooter)
    })

})