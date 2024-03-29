const t = require('../../test-utils')
const parser = require('@babel/parser')
const ModuleExplorer = t.requireModule('parser/jsExplorer/ModuleExplorer').ModuleExplorer
const ClassExplorer = t.requireModule('parser/jsExplorer/ClassExplorer').ClassExplorer

describe('ModuleExplorer', () => {

    function getExplorer(code) {
        return new ModuleExplorer(parser.parse(code, {sourceType: 'module'}))
    }

    test('classNodes', () => {
        const explorer = getExplorer(`class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes and annotation', () => {
        const explorer = getExplorer(`//annotation\nclass Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
        expect(classNodes[0].leadingComments[0].value).toBe('annotation')
    })

    test('classNodes module.exports', () => {
        const explorer = getExplorer(`module.exports = class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes module.exports', () => {
        const explorer = getExplorer(`module.exports = class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes named module.exports', () => {
        const explorer = getExplorer(`class Class1 {}\nmodule.exports = {ClassName: Class1}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes export', () => {
        const explorer = getExplorer(`export class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes export and annotation', () => {
        const explorer = getExplorer(`//annotation\nexport class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
        expect(classNodes[0].leadingComments[0].value).toBe('annotation')
    })

    test('classNodes export default', () => {
        const explorer = getExplorer(`export default class Class1 {}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes named export', () => {
        const explorer = getExplorer(`class Class1 {}\nexport {Class1 as ClassName}`)

        const classNodes = explorer.classNodes
        expect(classNodes.length).toBe(1)
        expect(classNodes[0].id.name).toBe('Class1')
    })

    test('classNodes multiple export and annotations', () => {
        const explorer = getExplorer(`
            class Class1 {};
            /*annotation1*/
            //annotation2
            export default class Class2 {}
            /*annotation3*/export class Class3 {
                constructor() {
                    const privateClass = class ClassP {};
                }
            }
            const privateClass = class ClassP {};
            module.exports = privateClass
            
            module.exports = class Class4 {};
        `)

        const classNodes = explorer.classNodes
        expect(classNodes.map(node => node.id.name)).toEqual(['Class1', 'Class2', 'Class3', 'Class4'])
        expect(classNodes.map(node => node.leadingComments ? node.leadingComments.map(comment => comment.value) : []))
            .toEqual([[], ['annotation1', 'annotation2'], ['annotation3'], []])
    })

    test('classExplorers', () => {
        const explorer = getExplorer(`
        // Comment 1
        export default class Class1 {
            // Comment 2
            
            get getter1() {
                // Comment 3
            }
            
            // @bionic get getter Int
        } 
        /* Comment 4 */`)

        const classExplorers = explorer.classExplorers
        expect(classExplorers.length).toBe(1)
        expect(classExplorers[0]).toBeInstanceOf(ClassExplorer)
        expect(classExplorers[0].programComments.map(node => node.value)).toEqual(
            [' Comment 1', ' Comment 2', ' Comment 3', ' @bionic get getter Int', ' Comment 4 '])

        expect(explorer.classExplorers).toBe(classExplorers)
    })
})