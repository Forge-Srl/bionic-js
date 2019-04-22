const t = require('../../../../test-utils')

describe('Swift classes acceptance', () => {

    let Class

    function getClassCode(classObj) {
        return classObj.getSwiftGenerator().getFiles()[0].content
    }

    beforeEach(() => {
        Class = t.requireModule('schema/Class')
    })

    test('class without inheritance', () => {
        const class1 = new Class('Class1', '', [], [], [], '', 'module/path')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: BjsClass {',
            '    ',
            '    class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    override class var bjsModulePath: String {',
            '        return "module/path"',
            '    }',
            '}')
    })

    test('class with inheritance', () => {
        const class1 = new Class('Class1', '', [], [], [], 'SuperClass', 'module/path')

        const sourceFile = getClassCode(class1)
        t.expectCode(sourceFile,
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class Class1: SuperClass {',
            '    ',
            '    override class func bjsFactory(_ jsObject: JSValue) -> Class1 {',
            '        return Class1(jsObject)',
            '    }',
            '    ',
            '    override class var bjsModulePath: String {',
            '        return "module/path"',
            '    }',
            '}')
    })
})