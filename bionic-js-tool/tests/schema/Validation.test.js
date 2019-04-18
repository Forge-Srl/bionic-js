const t = require('../test-utils')
const Validation = t.requireModule('schema/Validation')

describe('Validation', () => {

    const validateIdentifier = (identifierValue, expectedValidity, expectedError) => {
        const result = Validation.validateIdentifier('id name', identifierValue)
        expect(result.validity).toBe(expectedValidity)
        expect(result.error).toBe(expectedError)
    }

    test('validateIdentifier valid', () => validateIdentifier('IdName', true, null))

    test('validateIdentifier not valid (is null)', () => validateIdentifier(null, false, 'id name cannot be null'))

    test('validateIdentifier not valid (is empty)', () => validateIdentifier('', false, 'id name cannot be empty'))

    test('validateIdentifier not valid (start with a digit)', () => validateIdentifier('0IdName', false,
        'id name "0IdName" cannot start with a digit'))

    test('validateIdentifier not valid (contains characters other than alphanumeric)', () => validateIdentifier(
        'Id_name', false, 'id name "Id_name" cannot contain non-alphanumeric characters'))

    test('validateIdentifier not valid (contains space)', () => validateIdentifier('Id name', false,
        'id name "Id name" cannot contain non-alphanumeric characters'))


    const validateAll = (validities, expectedValidity, expectedError) => {
        const result = Validation.validateAll(validities)
        expect(result.validity).toBe(expectedValidity)
        expect(result.error).toBe(expectedError)
    }

    test('validateAll valid', () => validateAll([{validity: true, error: null}], true, null))

    test('validateAll valid+valid', () => validateAll([{validity: true, error: null}], true, null))

    test('validateAll valid+invalid', () => validateAll([{validity: true, error: null},
        {validity: false, error: 'error 1'}], false, 'error 1'))

    test('validateAll invalid+invalid', () => validateAll([{validity: false, error: 'error 1'},
        {validity: false, error: 'error 2'}], false, 'error 1\nerror 2'))
})