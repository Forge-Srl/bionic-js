const {JsExplorer} = require('./JsExplorer')

class ParameterExplorer extends JsExplorer {

    get name() {
        return !this.rest ? this.node.name : this.node.argument.name
    }

    get rest() {
        return this.node.type === 'RestElement'
    }
}

module.exports = {ParameterExplorer}