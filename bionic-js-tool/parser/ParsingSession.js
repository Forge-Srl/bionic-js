/* This file contains all the retrieved classes' temporary schemas (obtained from explorers) and must be passed
to ModuleParser to generate the final schemas

*/

class ParsingSession {

    constructor() {
        this.classes = new Map()
    }

}

module.exports = {ParsingSession}