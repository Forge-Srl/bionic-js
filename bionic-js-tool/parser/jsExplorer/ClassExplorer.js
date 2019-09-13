const {JsExplorer} = require('./JsExplorer')
const {MethodJsExplorer} = require('./MethodJsExplorer')
const {Class} = require('../../schema/Class')
const {Constructor} = require('../../schema/Constructor')
const {Method} = require('../../schema/Method')
const {Property} = require('../../schema/Property')
const {MethodAnnotationExplorer} = require('./MethodAnnotationExplorer')

class ClassExplorer extends JsExplorer {

    constructor(node, programComments, modulePath) {
        super(node)
        Object.assign(this, {programComments, modulePath})
    }

    get isToExport() {
        return !!(this.bionicTag || this.methodExplorers.find(methodExplorer => methodExplorer.bionicTag))
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

    get methodExplorers() {
        if (!this._methodExplorers) {
            this._methodExplorers = [...this.methodJsExplorers,
                ...this.innerComments.map(innerComment => new MethodAnnotationExplorer(innerComment))
                    .filter(methodExplorer => methodExplorer.isToExport)]
        }
        return this._methodExplorers
    }


    // TODO: remove
    get methodsSchemas() {
        if (!this._methodsSchemas) {
            this._methodsSchemas = this.methodExplorers.map(explorer => explorer.schema)
        }
        return this._methodsSchemas
    }

    // TODO: remove
    get schema() {
        if (this.methodsSchemas.length === 0 && !this.bionicTag)
            return null

        const constructors = this.methodsSchemas.filter(method => method instanceof Constructor)
        const properties = this.methodsSchemas.filter(method => method instanceof Property)
        const methods = this.methodsSchemas.filter(method => method instanceof Method)
        return new Class(this.name, this.description, constructors, properties, methods, this.superclassName,
            this.modulePath)
    }
}

module.exports = {ClassExplorer}