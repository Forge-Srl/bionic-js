const {dependency1} = require('./dependency1')
const {native1} = require('./native/native1')

console.log(`main.js, ${dependency1.dep}, ${native1.dep}`)

/*
 Webpack + bjs-plugin has to:
 1- process all .js files, parse annotations and create a project schema
 2- replace .js files in the native path (containing bionic annotations)
    with auto-generated .js proxies that call the native implementation
 3- create a single entry point .js file containing references to all the
    exported classes
 4- create a single .js bundle in two configurations: PRO and DEV
 - PRO must be minimized/optimized
 - DEV must support browser debug, with files and paths reporting

 NOTE: main.js file could be the bjs config file
*/
