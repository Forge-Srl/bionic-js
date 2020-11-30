class Validation {

    static validateIdentifier(name, value) {
        if (value === null)
            return {
                validity: false,
                error: `${name} cannot be null`
            }

        if (value.length === 0)
            return {
                validity: false,
                error: `${name} cannot be empty`
            }

        if (/^[0-9]+/.test(value))
            return {
                validity: false,
                error: `${name} "${value}" cannot start with a digit`
            }

        if (/[^a-zA-Z0-9]/.test(value))
            return {
                validity: false,
                error: `${name} "${value}" cannot contain non-alphanumeric characters`
            }

        return {validity: true, error: null}
    }

    static validateAll(validities) {
        const invalids = validities.filter(v => !v.validity)
        const isValid = invalids.length === 0
        return {validity: isValid, error: isValid ? null : invalids.map(v => v.error).join('\n')}
    }
}

module.exports = {Validation}