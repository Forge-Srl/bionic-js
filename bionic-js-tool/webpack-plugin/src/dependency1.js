const {dependency2} = require('./dependency2')

module.exports = {dependency1: {dep: `dependency1, ${dependency2.dep}`}}
