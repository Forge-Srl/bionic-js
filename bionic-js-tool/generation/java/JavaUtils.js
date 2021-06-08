const {JavaKeywords} = require('./JavaKeywords')

class JavaUtils {

    static pathToSafePath(path) {
        const split = path.split('/')
        const last = split.pop()

        return split
            .map(folder => JavaKeywords.getSafeIdentifier(folder))
            .concat(last)
            .join('/')
    }

    static pathToPackage(fullClassPath) {
        const pathParts = fullClassPath.split('/')
        pathParts.pop()
        return pathParts.map(folder => JavaKeywords.getSafeIdentifier(folder)).join('.')
    }

    static fullPackage(basePackage, classPath) {
        const subPackage = this.pathToPackage(classPath)
        return basePackage
            ? (subPackage ? `${basePackage}.${subPackage}` : basePackage)
            : subPackage
    }
}

module.exports = {JavaUtils}