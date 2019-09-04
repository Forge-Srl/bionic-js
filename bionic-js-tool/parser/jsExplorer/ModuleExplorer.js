const {JsExplorer} = require('./JsExplorer')
const {ClassExplorer} = require('./ClassExplorer')

class ModuleExplorer extends JsExplorer {

    constructor(node, modulePath) {
        super(node)
        Object.assign(this, {modulePath})
    }

    get classNodes() {
        return this.depthSearch(this.node, this.selectTypes('ClassExpression', 'ClassDeclaration'))
    }

    get classExplorers() {
        return this.classNodes.map(classNode => new ClassExplorer(classNode, this.node.comments))
    }

    selectTypes(...types) {
        return node => types.includes(node.type)
    }

    depthSearch(node, matchFunction) {
        if (matchFunction(node))
            return [node]

        switch (node.type) {
            case 'File':
                return this.depthSearch(node.program, matchFunction)

            case 'Program':
                return node.body.flatMap(node => this.depthSearch(node, matchFunction))

            case 'ExpressionStatement':
                return this.depthSearch(node.expression, matchFunction)

            case 'AssignmentExpression':
                return this.depthSearch(node.right, matchFunction)

            case 'ExportNamedDeclaration':
            case 'ExportDefaultDeclaration':
                return this.depthSearch(node.declaration, matchFunction)

            default:
                return []
        }
    }
}

module.exports = {ModuleExplorer}