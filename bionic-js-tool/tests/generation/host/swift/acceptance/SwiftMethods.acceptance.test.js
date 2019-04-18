const t = require('../../../../test-utils')

describe('Swift constructors acceptance', () => {

    let Class, Constructor, Parameter, IntType, expectedHeader, expectedFooter

    function getClassCode(classObj) {
        return classObj.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
        Constructor = t.requireModule('schema/Constructor')
        Parameter = t.requireModule('schema/Parameter')
        IntType = t.requireModule('schema/types/IntType')

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

    test('class with constructor', () => {

        const class2Type = new ObjectType('Class2')
        const parameter = new Parameter(class2Type, 'class2', '')
        const class1 = new Class('Class1', '', [new Constructor('', [parameter])], [], [], '', '')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            'import JavaScriptCore',
            'import Bjs',
            '',
            'convenience init() {',
            '    self.init(Class1.bjsClass, [])',
            '}',
            '',
            'class Class1: BjsClass {',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    class var bjsModulePath: String {',
            '        return ""',
            '    }',
            '}')
    })

})