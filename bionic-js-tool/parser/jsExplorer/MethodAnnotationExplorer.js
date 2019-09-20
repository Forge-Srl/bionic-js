const {AnnotationParser} = require('../annotation/AnnotationParser')
const {Type} = require('../../schema/types/Type')

class MethodAnnotationExplorer extends AnnotationParser {

    get bionicTag() {
        if (!this._bionicTag) {
            this._bionicTag = this.tags.get('BionicTag')
        }
        return this._bionicTag
    }

    get isToExport() {
        return !!this.bionicTag
    }

    get name() {
        return this.bionicTag.name
    }

    get kinds() {
        return this.bionicTag.kinds
    }

    get isStatic() {
        return this.bionicTag.modifiers.includes('static')
    }

    get isGenerator() {
        return false
    }

    get isAsync() {
        return this.bionicTag.modifiers.includes('async')
    }

    get type() {
        if (!this._type) {
            this._type = Type.fromObj(this.bionicTag.typeInfo)
        }
        return this._type
    }
}

module.exports = {MethodAnnotationExplorer}