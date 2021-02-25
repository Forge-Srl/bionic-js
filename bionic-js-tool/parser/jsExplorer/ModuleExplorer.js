const {JsExplorer} = require('./JsExplorer')
const {ClassExplorer} = require('./ClassExplorer')

class ModuleExplorer extends JsExplorer {

    constructor(node, modulePath) {
        super(node)
        Object.assign(this, {modulePath})
    }

    get classNodes() {
        return this.depthSearchClassNodes(this.node)
    }

    get classExplorers() {
        if (!this._classExplorers) {
            this._classExplorers = this.classNodes
                .map(classNode => new ClassExplorer(classNode, this.node.comments, this.modulePath))
                .filter(classExplorer => classExplorer.isToExport)
        }
        return this._classExplorers
    }

    depthSearchClassNodes(node) {
        if (!node || !node.type) {
            return []
        }
        if (['ClassExpression', 'ClassDeclaration'].includes(node.type)) {
            return [node]
        }
        switch (node.type) {
            case 'File':
                return this.depthSearchClassNodes(node.program)

            case 'Program':
                return node.body.flatMap(node => this.depthSearchClassNodes(node))

            case 'ExpressionStatement':
                return this.depthSearchClassNodes(node.expression)

            case 'AssignmentExpression':
                return this.depthSearchClassNodes(node.right)

            case 'ExportNamedDeclaration':
            case 'ExportDefaultDeclaration':
                return this.depthSearchClassNodes(node.declaration)
                    .map(classNode => Object.assign(classNode, {leadingComments: node.leadingComments}))

            default:
                return []
        }
    }
}

module.exports = {ModuleExplorer}