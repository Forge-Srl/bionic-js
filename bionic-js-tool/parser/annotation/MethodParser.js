const {AnnotationParser} = require('./AnnotationParser')
const {Type} = require('../../schema/types/Type')
const {LambdaType} = require('../../schema/types/LambdaType')

class MethodParser extends AnnotationParser {

    get bionicTag() {
        if (!this._bionicTag) {
            this._bionicTag = this.tags.get('BionicTag')
        }
        return this._bionicTag
    }

    get name() {
        return this.bionicTag.name
    }

    get kinds() {
        return this.bionicTag.kinds
    }

    get static() {
        return this.bionicTag.modifiers.includes('static')
    }

    get async() {
        return this.bionicTag.modifiers.includes('async')
    }

    get type() {
        if (!this._type) {
            this._type = Type.fromObj(this.bionicTag.typeInfo)
        }
        return this._type
    }

    get signature() {
        if (!(this.type instanceof LambdaType)) {
            throw new Error(`Method named "${this.name}" has an annotations without a lambda type definition`)
        }
        return this.type
    }
}

module.exports = {MethodParser}