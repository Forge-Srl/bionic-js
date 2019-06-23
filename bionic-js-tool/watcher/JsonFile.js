const {File} = require('./File')

class JsonFile extends File {

    async getObject() {
        const content = await this.getContent()
        try {
            return JSON.parse(content)
        } catch (error) {
            throw new Error(`Error parsing json file "${this.path}"\n${error.stack}`)
        }
    }
}

module.exports = {JsonFile}