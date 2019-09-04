const {AnnotationParser} = require('../annotation/AnnotationParser')

class JsExplorer {

    constructor(node) {
        Object.assign(this, {node})
    }

    get topComment() {
        if (!this.node.leadingComments) {
            return null
        }
        return this.node.leadingComments[this.node.leadingComments.length - 1]
    }

    get topCommentText() {
        const topComment = this.topComment
        return topComment === null ? '' : topComment.value
    }

    get annotationTags() {
        if (!this._tags) {
            this._tags = new AnnotationParser(this.topCommentText).tags
        }
        return this._tags
    }

    get bionicTag() {
        return this.annotationTags.get('BionicTag')
    }

    get description() {
        return this.annotationTags.get('DescriptionTag')
    }
}

module.exports = {JsExplorer}