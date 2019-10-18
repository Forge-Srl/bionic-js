const promisify = require('./promisify')
module.exports = promisify('fs', 'readFile', 'writeFile', 'readdir', 'stat', 'access', 'unlink')