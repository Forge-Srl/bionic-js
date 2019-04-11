const t = require('../../common')
const parser = require('@babel/parser')
const ClassExplorer = t.requireModule('parser/explorers/ClassExplorer')
const MethodExplorer = t.requireModule('parser/explorers/MethodExplorer')
const Constructor = t.requireModule('schema/Constructor')
const Property = t.requireModule('schema/Property')
const Method = t.requireModule('schema/Method')
const Class = t.requireModule('schema/Class')

describe('ClassExplorer', () => {

    test('topCommentText', () => {
        const explorer = getExplorer(
            '// Skipped annotation\n' +
            '/*\n' +
            ' * Last\n' +
            ' * annotation\n' +
            ' */\n' +
            'class Class1 {}')
        const topCommentText = explorer.topCommentText
        expect(topCommentText).toBe('\n * Last\n * annotation\n ')
    })

    function getExplorer(code) {
        const file = parser.parse(code, {sourceType: 'module'})
        return new ClassExplorer(file.program.body[0], file.comments)
    }

    test('name', () => {
        const explorer = getExplorer(`class Class1 {}`)
        const className = explorer.name
        expect(className).toBe('Class1')
    })

    test('superClassName', () => {
        const explorer = getExplorer(`class C extends SuperClass {}`)
        const className = explorer.superClassName
        expect(className).toBe('SuperClass')
    })

    test('superClassName with no super class', () => {
        const explorer = getExplorer(`class Class1 {}`)
        const className = explorer.superClassName
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

    test('methodsNodes', () => {
        const explorer = getExplorer(methodNodesTestCode)
        const methodsNodes = explorer.methodsNodes
        expect(methodsNodes.map(node => node.key.name)).toEqual(['constructor', 'method1', 'getter1', 'setter1', 'method2',
            'getter2', 'setter2'])
    })

    test('methodsNodes singleton', () => {
        const explorer = getExplorer(methodNodesTestCode)
        const methodsNodes = explorer.methodsNodes
        expect(explorer.methodsNodes).toBe(methodsNodes)
    })


    let methodsExplorersTestCode = `
            class Class1 {
                constructor() {}
                method1() {}
            }`

    test('methodsExplorers', () => {
        const explorer = getExplorer(methodsExplorersTestCode)

        const methodsExplorers = explorer.methodsExplorers
        expect(methodsExplorers.length).toBe(2)
        expect(methodsExplorers[0]).toBeInstanceOf(MethodExplorer)
        expect(methodsExplorers.map(method => method.name)).toEqual(['constructor', 'method1'])
    })

    test('methodsExplorers singleton', () => {
        const explorer = getExplorer(methodsExplorersTestCode)

        const methodsExplorers = explorer.methodsExplorers
        expect(explorer.methodsExplorers).toBe(methodsExplorers)
    })

    test('methodsSchemas', () => {
        const explorer = new ClassExplorer()

        t.mockGetter(explorer, 'methodsExplorers', () => [{schema: 'schema1'}, {schema: 'schema2'}])
        expect(explorer.methodsSchemas).toEqual(['schema1', 'schema2'])
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
    })

    test('innerComments singleton', () => {
        const explorer = getExplorer(innerCommentsTestCode)
        const innerComments = explorer.innerComments
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
                // Inner annotation 2
                /* @bionic Int */
                get getter1() { return 0; }
                // Inner annotation 3
                get getter2() { return 0; }
                
                /* @bionic another inner annotation */
            }`)
        const innerComments = explorer.innerComments
        expect(innerComments).toEqual([' Inner annotation 1 ', ' Inner annotation 2', ' Inner annotation 3',
            ' @bionic another inner annotation '])
    })

    test('schema', () => {
        const explorer = new ClassExplorer()
        const constructor = new Constructor()
        const method1 = new Method()
        const method2 = new Method()
        const property1 = new Property()
        const property2 = new Property()

        t.mockGetter(explorer, 'methodsSchemas', () => [constructor, method1, method2, property1, property2])
        t.mockGetter(explorer, 'name', () => 'ClassName')
        t.mockGetter(explorer, 'description', () => 'class desc')
        t.mockGetter(explorer, 'superClassName', () => 'SuperClassName')
        t.mockGetter(explorer, 'modulePath', () => 'module path')

        const actualClass = explorer.schema
        expect(actualClass).toEqual(new Class('ClassName', 'class desc', [constructor], [property1, property2],
            [method1, method2], 'SuperClassName', 'module path'))
    })
})