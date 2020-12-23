const promisify = require('./promisify')
module.exports = promisify('graceful-fs', 'readFile', 'writeFile', 'readdir', 'stat', 'access', 'unlink')