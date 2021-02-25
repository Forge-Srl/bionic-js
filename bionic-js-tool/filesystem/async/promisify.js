const util = require('util')

module.exports = function (requiredModule, ... functionNames) {
    const module = require(requiredModule)
    const promisifiedModule = {}

    if (functionNames.length === 0) {
        return util.promisify(module)
    }

    for (const functionName of functionNames) {
        promisifiedModule[functionName] = util.promisify(module[functionName])
    }
    promisifiedModule.orig = module
    return promisifiedModule
}