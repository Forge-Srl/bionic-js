const Parser = require('./Parser')

class AnnotationParser {

    constructor(annotation) {
        Object.assign(this, {annotation})
    }

    get tags() {
        if (!this._tags) {
            this._tags = new Map()
            const tagsTexts = this.parseWithRule(this.annotation, 'CommentText')
            for (const tagText of tagsTexts) {
                const tag = this.parseWithRule(tagText, 'Tags')
                if (tag === 'UnknownTag')
                    continue

                if (this._tags.get(tag)) {
                    throw new Error(`the tag "${tag}" was inserted more than one time in the annotation`)
                }
                this._tags.set(tag, this.parseWithRule(tagText, tag))
            }
        }
        return this._tags
    }

    parseWithRule(annotation, rule) {
        return Parser.parse(annotation, {startRule: rule})
    }
}

module.exports = {AnnotationParser}