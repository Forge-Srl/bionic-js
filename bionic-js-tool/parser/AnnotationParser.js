const Parser = require('./Parser')

class AnnotationParser {

    get tags() {
        if (!this._tags) {

            this._tags = new Map()
            const tagsTexts = this.parseWithRule(this.annotation, 'CommentText')
            for (const tagText of tagsTexts) {
                const tag = this.parseWithRule(tagText, 'Tags')
                if (tag === 'UnknownTag')
                    continue

                if (this._tags.get(tag)) {
                    throw new Error(`The tag "${tag}" was inserted more than one time in the annotation`)
                }
                this._tags.set(tag, this.parseWithRule(tagText, tag))
            }
        }
        return this._tags
    }

    constructor(annotation) {
        Object.assign(this, {annotation})
    }

    parseWithRule(annotation, rule) {
        return Parser.parse(annotation, {startRule: rule})
    }

    static parse(annotation) {
        const tagsTexts = this.parseWithRule(annotation, 'CommentText')
        const parsedTags = []

        for (const tagText of tagsTexts) {
            const tag = this.parseWithRule(tagText, 'Tags')

            let parsedValue
            if (tag.bionic) {
                parsedValue = this.parseWithRule(tagText, 'BionicTag')
            } else if (tag.description) {
                parsedValue = this.parseWithRule(tagText, 'DescriptionTag')
            }

            if (parsedValue) {
                parsedTags.push(Object.assign(tag, {value: parsedValue}))
            }
        }

        return parsedTags
    }
}

module.exports = AnnotationParser