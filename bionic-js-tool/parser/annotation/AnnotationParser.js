const Parser = require('./Parser')

class AnnotationParser {

    static parseWithRule(annotation, rule) {
        return Parser.parse(annotation, {startRule: rule})
    }

    constructor(annotation) {
        Object.assign(this, {annotation})
    }

    get tags() {
        if (!this._tags) {
            try {
                const tags = new Map()
                const tagsTexts = this.constructor.parseWithRule(this.annotation, 'TagLine')
                for (const tagText of tagsTexts) {
                    const tag = this.constructor.parseWithRule(tagText, 'Tags')
                    if (tag === 'UnknownTag') {
                        continue
                    }

                    if (tags.get(tag)) {
                        throw new Error(`the tag "${tag}" was inserted more than one time in the annotation`)
                    }
                    tags.set(tag, this.constructor.parseWithRule(tagText, tag))
                }
                this._tags = tags
            } catch (error) {
                error.message = `parsing annotation "${this.annotation.trim()}"\n${error.message}`
                throw error
            }
        }
        return this._tags
    }
}

module.exports = {AnnotationParser}