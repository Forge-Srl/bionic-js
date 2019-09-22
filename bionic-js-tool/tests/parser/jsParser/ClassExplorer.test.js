const t = require('../../test-utils')
const parser = require('@babel/parser')
const ClassExplorer = t.requireModule('parser/jsExplorer/ClassExplorer').ClassExplorer
const MethodJsExplorer = t.requireModule('parser/jsExplorer/MethodJsExplorer').MethodJsExplorer
const MethodAnnotationExplorer = t.requireModule('parser/jsExplorer/MethodAnnotationExplorer').MethodAnnotationExplorer

describe('ClassExplorer', () => {

    function getExplorer(code) {
        const file = parser.parse(code, {sourceType: 'module'})
        return new ClassExplorer(file.program.body[0], file.comments)
    }

    test('isToExport, nothing to export', () => {
        const explorer = getExplorer(`/* @desc description */class Class1 { method() {} }`)
        expect(explorer.isToExport).toBe(false)
    })

    test('isToExport, bionic class', () => {
        const explorer = getExplorer(`/* @bionic */class Class1 { method() {} }`)
        expect(explorer.isToExport).toBe(true)
    })

    test('isToExport, bionic method', () => {
        const explorer = getExplorer(`class Class1 { /* @bionic */ method() {} }`)
        expect(explorer.isToExport).toBe(true)
    })

    test('isToExport, bionic get', () => {
        const explorer = getExplorer(`class Class1 { /* @bionic */ get getter() {} }`)
        expect(explorer.isToExport).toBe(true)
    })

    test('name', () => {
        const explorer = getExplorer(`class Class1 {}`)
        const className = explorer.name
        expect(className).toBe('Class1')
    })

    test('superclassName', () => {
        const explorer = getExplorer(`class C extends Superclass {}`)
        expect(explorer.superclassName).toBe('Superclass')
    })

    test('superclassName with no superclass', () => {
        const explorer = getExplorer(`class Class1 {}`)
        const className = explorer.superclassName
        expect(className).toBe(null)
    })


    const methodNodesTestCode = `
            class Class1 {
                constructor() {}
                method1() {}
                get getter1() {}
                set setter1(value) {}
                static method2() {}
                static get getter2() {}
                static set setter2(value) {}
            }`

    test('methodNodes', () => {
        const explorer = getExplorer(methodNodesTestCode)
        const methodNodes = explorer.methodNodes
        expect(methodNodes.map(node => node.key.name)).toEqual(['constructor', 'method1', 'getter1', 'setter1', 'method2',
            'getter2', 'setter2'])

        expect(explorer.methodNodes).toBe(methodNodes)
    })


    const methodExplorersTestCode = `
            class Class1 {
                // @bionic
                constructor() {}
                
                /* @bionic get getter Int */
                // comment to exclude the following method
                method1() {}
                
                // @desc description of nothing
                // @unknown tag
                
                // @bionic
                method2() {}
                // @bionic method method3 () => Void
            }`

    test('methodJsExplorers', () => {
        const explorer = getExplorer(methodExplorersTestCode)

        const methodJsExplorers = explorer.methodJsExplorers
        expect(methodJsExplorers[0]).toBeInstanceOf(MethodJsExplorer)
        expect(methodJsExplorers.map(method => method.name)).toEqual(['constructor', 'method2'])

        expect(explorer.methodJsExplorers).toBe(methodJsExplorers)
    })

    test('methodExplorers', () => {
        const explorer = getExplorer(methodExplorersTestCode)

        const methodExplorers = explorer.methodExplorers
        expect(methodExplorers.map(method => method.name)).toEqual(['constructor', 'method2', 'getter', 'method3'])
        expect(methodExplorers[0]).toBeInstanceOf(MethodJsExplorer)
        expect(methodExplorers[1]).toBeInstanceOf(MethodJsExplorer)
        expect(methodExplorers[2]).toBeInstanceOf(MethodAnnotationExplorer)
        expect(methodExplorers[3]).toBeInstanceOf(MethodAnnotationExplorer)

        expect(explorer.methodExplorers).toBe(methodExplorers)
    })

    test('methodExplorers, no methods', () => {
        const explorer = getExplorer('class Class1 {}')

        const methodExplorers = explorer.methodExplorers
        expect(methodExplorers.map(method => method.name)).toEqual([])
    })


    const innerCommentsTestCode = `
            // Skipped annotation
            class Class1 /* Skipped */ {
                // Inner annotation 1
                /* Inner annotation 2 */
                // Inner annotation 3
            } // Skipped`

    test('innerComments of empty class', () => {
        const explorer = getExplorer(innerCommentsTestCode)
        const innerComments = explorer.innerComments

        expect(innerComments).toEqual([' Inner annotation 1', ' Inner annotation 2 ', ' Inner annotation 3'])

        expect(explorer.innerComments).toBe(innerComments)
    })


    test('innerComments of class with methods', () => {
        const explorer = getExplorer(`
            class Class1 {
                // Inner annotation 1
                method1() { /* Skipped */ }
                
                /* Inner annotation 2 */
                get /* Skipped */ getter1() { // Skipped
                    let value = 84; // Skipped                
                }
                // Inner annotation 3
            }`)
        const innerComments = explorer.innerComments
        expect(innerComments).toEqual([' Inner annotation 1', ' Inner annotation 2 ', ' Inner annotation 3'])
    })

    test('innerComments of class with bionic methods', () => {
        const explorer = getExplorer(`
            class Class1  {
                /* Inner annotation 1 */
                // @bionic ()
                method1() { }
                // @bionic Inner annotation 2
                /* @bionic Int */
                get getter1() { return 0; }
                // @bionic Inner annotation 3
                // Inner annotation 4
                get getter2() { return 0; }
                
                /* @bionic another\n` +
            ` inner annotation */
            }`)
        const innerComments = explorer.innerComments
        expect(innerComments).toEqual([' Inner annotation 1 ', ' @bionic Inner annotation 2',
            ' @bionic Inner annotation 3', ' Inner annotation 4', ' @bionic another\n inner annotation '])
    })
})
