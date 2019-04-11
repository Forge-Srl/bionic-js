const JsExplorer = require('./JsExplorer')
const MethodExplorer = require('./MethodExplorer')
const Class = require('../../schema/Class')
const Constructor = require('../../schema/Constructor')
const Method = require('../../schema/Method')
const Property = require('../../schema/Property')

class ClassExplorer extends JsExplorer {

    constructor(node, programComments, modulePath) {
        super(node)
        Object.assign(this, {programComments, modulePath})
    }

    get name() {
        return this.node.id.name
    }

    get superClassName() {
        const superClassNode = this.node.superClass
        return superClassNode ? superClassNode.name : null
    }

    get methodsNodes() {
        if (!this._methodNodes) {
            this._methodNodes = this.node.body.body.filter(node => node.type === 'ClassMethod')
        }
        return this._methodNodes
    }

    get methodsExplorers() {
        if (!this._methodExplorers) {
            this._methodExplorers = this.methodsNodes.map(methodNode => new MethodExplorer(methodNode))
        }
        return this._methodExplorers
    }

    get methodsSchemas() {
        return this.methodsExplorers.map(explorer => explorer.schema)
    }

    get innerComments() {
        if (!this._innerComments) {
            const isCommentOutsideMethods = comment =>
                !this.methodsNodes.some(method => comment.start >= method.start && comment.end <= method.end)

            const classBody = this.node.body
            const isCommentInsideClass = comment =>
                comment.start >= classBody.start && comment.end <= classBody.end

            const isCommentUnusedByMethods = comment =>
                !this.methodsExplorers.some(explorer => explorer.bionicTag && explorer.topComment.start
                    === comment.start)

            this._innerComments = this.programComments.filter(comment => isCommentOutsideMethods(comment) &&
                isCommentInsideClass(comment) && isCommentUnusedByMethods(comment)).map(node => node.value)
        }
        return this._innerComments
    }

    get schema() {
        const constructors = this.methodsSchemas.filter(method => method instanceof Constructor)
        const properties = this.methodsSchemas.filter(method => method instanceof Property)
        const methods = this.methodsSchemas.filter(method => method instanceof Method)
        return new Class(this.name, this.description, constructors, properties, methods, this.superClassName,
            this.modulePath)
    }
}

module.exports = ClassExplorer