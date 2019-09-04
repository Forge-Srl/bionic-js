const {JsExplorer} = require('./JsExplorer')
const {MethodExplorer} = require('./MethodExplorer')
const {Class} = require('../../schema/Class')
const {Constructor} = require('../../schema/Constructor')
const {Method} = require('../../schema/Method')
const {Property} = require('../../schema/Property')
const {MethodParser} = require('../annotation/MethodParser')

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

    get superClassName() {
        const superClassNode = this.node.superClass
        return superClassNode ? superClassNode.name : null
    }

    get methodNodes() {
        if (!this._methodNodes) {
            this._methodNodes = this.node.body.body.filter(node => node.type === 'ClassMethod')
        }
        return this._methodNodes
    }

    get methodExplorers() {
        if (!this._methodExplorers) {
            this._methodExplorers = this.methodNodes.map(methodNode => new MethodExplorer(methodNode))
                .filter(methodExplorer => methodExplorer.isToExport)
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
                !this.methodExplorers.some(explorer => explorer.topComment.start === comment.start)

            this._innerComments = this.programComments.filter(comment => isCommentOutsideMethods(comment) &&
                isCommentInsideClass(comment) && isCommentUnusedByMethods(comment)).map(node => node.value)
        }
        return this._innerComments
    }

    get methodParsers() {
        return this.innerComments.map(comment => new MethodParser(comment))
            .filter(annotationParser => annotationParser.bionicTag)
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
        return new Class(this.name, this.description, constructors, properties, methods, this.superClassName,
            this.modulePath)
    }
}

module.exports = {ClassExplorer}