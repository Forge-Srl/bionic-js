const t = require('../../common')
const parser = require('@babel/parser')
const ProgramExplorer = t.requireModule('parser/explorers/ProgramExplorer')
const ClassExplorer = t.requireModule('parser/explorers/ClassExplorer')

describe('ProgramExplorer', () => {

    function getExplorer(code) {
        return new ProgramExplorer(parser.parse(code, {sourceType: 'module'}))
    }

    test('classes', () => {
        const explorer = getExplorer(`
        // Comment 1
        export default class Class1 {
            // Comment 2
            
            get getter1() {
                // Comment 3
            }
        } 
        /* Comment 4 */`)

        const classes = explorer.classes
        expect(classes.length).toBe(1)
        expect(classes[0]).toBeInstanceOf(ClassExplorer)
        expect(classes[0].programComments.map(node => node.value)).toEqual(
            [' Comment 1', ' Comment 2', ' Comment 3', ' Comment 4 '])
    })


    test('classesNodes', () => {
        const explorer = getExplorer(`class Class1 {}`)

        const classesNodes = explorer.classesNodes
        expect(classesNodes.length).toBe(1)
        expect(classesNodes[0].id.name).toBe('Class1')
    })

    test('classesNodes module.exports', () => {
        const explorer = getExplorer(`module.exports = class Class1 {}`)

        const classesNodes = explorer.classesNodes
        expect(classesNodes.length).toBe(1)
        expect(classesNodes[0].id.name).toBe('Class1')
    })

    test('classesNodes export', () => {
        const explorer = getExplorer(`export class Class1 {}`)

        const classesNodes = explorer.classesNodes
        expect(classesNodes.length).toBe(1)
        expect(classesNodes[0].id.name).toBe('Class1')
    })

    test('classesNodes export default', () => {
        const explorer = getExplorer(`export default class Class1 {}`)

        const classesNodes = explorer.classesNodes
        expect(classesNodes.length).toBe(1)
        expect(classesNodes[0].id.name).toBe('Class1')
    })

    test('classesNodes multiple export', () => {
        const explorer = getExplorer(`
            class Class1 {};
            export default class Class2 {}
            export class Class3 {
                constructor() {
                    const privateClass = class ClassP {};
                }
            }
            const privateClass = class ClassP {};
            module.exports = privateClass
            
            module.exports = class Class4 {};
        `)

        const classesNodes = explorer.classesNodes
        expect(classesNodes.map(node => node.id.name)).toEqual(['Class1', 'Class2', 'Class3', 'Class4'])
    })
})