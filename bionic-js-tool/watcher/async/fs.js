const promisify = require('./promisify')
module.exports = promisify('fs', 'readFile', 'writeFile', 'stat', 'access')