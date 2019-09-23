const {JsExplorer} = require('./JsExplorer')
const {MethodJsExplorer} = require('./MethodJsExplorer')
const {MethodAnnotationExplorer} = require('./MethodAnnotationExplorer')

class ClassExplorer extends JsExplorer {

    constructor(node, programComments, modulePath) {
        super(node)
        Object.assign(this, {programComments, modulePath})
    }

    get isToExport() {
        try {
            return !!(this.bionicTag || this.methodExplorers.find(methodExplorer => methodExplorer.bionicTag))
        } catch (error) {
            error.message = `parsing annotations of class "${this.name}" in module "${this.modulePath}"\n${error.message}`
            throw error
        }
    }

    get name() {
        return this.node.id.name
    }

    get superclassName() {
        const superclassNode = this.node.superClass
        return superclassNode ? superclassNode.name : null
    }

    get methodNodes() {
        if (!this._methodNodes) {
            this._methodNodes = this.node.body.body.filter(node => node.type === 'ClassMethod')
        }
        return this._methodNodes
    }

    get methodJsExplorers() {
        if (!this._methodJsExplorers) {
            this._methodJsExplorers = [...this.methodNodes.map(methodNode => new MethodJsExplorer(methodNode))
                .filter(methodExplorer => methodExplorer.isToExport)]
        }
        return this._methodJsExplorers
    }

    get methodExplorers() {
        if (!this._methodExplorers) {
            this._methodExplorers = [...this.methodJsExplorers,
                ...this.innerComments.map(innerComment => new MethodAnnotationExplorer(innerComment))
                    .filter(methodExplorer => methodExplorer.isToExport)]
        }
        return this._methodExplorers
    }

    get innerComments() {
        if (!this._innerComments) {
            const isCommentOutsideMethods = comment =>
                !this.methodNodes.some(method => comment.start >= method.start && comment.end <= method.end)

            const classBody = this.node.body
            const isCommentInsideClass = comment =>
                comment.start >= classBody.start && comment.end <= classBody.end

            const isCommentUnusedByMethods = comment =>
                !this.methodJsExplorers.some(explorer => explorer.topComment.start === comment.start)

            this._innerComments = this.programComments.filter(comment => isCommentOutsideMethods(comment) &&
                isCommentInsideClass(comment) && isCommentUnusedByMethods(comment)).map(node => node.value)
        }
        return this._innerComments
    }
}

module.exports = {ClassExplorer}