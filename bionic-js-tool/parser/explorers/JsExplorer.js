const {AnnotationParser} = require('../AnnotationParser')

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
}

module.exports = {JsExplorer}