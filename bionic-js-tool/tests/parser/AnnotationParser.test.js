const t = require('../test-utils')
const AnnotationParser = t.requireModule('parser/AnnotationParser').AnnotationParser

describe('AnnotationParser', () => {

    const testAnnotation = (annotation, expectedTags) => {
        const parser = new AnnotationParser(annotation)
        const tags = Array.from(parser.tags.entries())
        expect(tags).toEqual(expectedTags)
    }

    test('parse unknown tag', () => testAnnotation('@unknown', []))

    test('parse bionic tag empty', () => testAnnotation('@bionic', [
        ['BionicTag', {}]
    ]))

    test('parse bionic tag not empty', () => testAnnotation('@bionic Int', [
        ['BionicTag', {typeInfo: {type: 'Int'}}]
    ]))

    test('parse description tag', () => testAnnotation('@description my description', [
        ['DescriptionTag', 'my description']
    ]))

    test('parse desc tag', () => testAnnotation('@desc my description', [
        ['DescriptionTag', 'my description']
    ]))

    test('parse mixed tags', () => testAnnotation(
        'Starting comment\n@desc my description\n * @bionic Int\n@unknown_tag\nEnding comment\n', [
            ['DescriptionTag', 'my description'],
            ['BionicTag', {typeInfo: {type: 'Int'}}]
        ]))

    test('parse repeating tags', () => {
        expect(() => testAnnotation('@bionic\n@bionic Int')).toThrow()
    })
})