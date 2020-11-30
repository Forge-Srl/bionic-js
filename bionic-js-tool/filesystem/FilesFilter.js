const ignore = require('ignore')

class FilesFilter {

    constructor(ignoredPaths, allowedExtensions) {
        Object.assign(this, {ignoredPaths, allowedExtensions})
    }

    get ignoreFilter() {
        if (!this.ignore) {
            this.ignore = ignore({ignorecase: false})
            if (this.ignoredPaths)
                this.ignore.add(this.ignoredPaths)

        }
        return this.ignore
    }

    isToFilter(file) {
        return this.ignoreFilter.ignores(file.relativePath) ||
            (!!this.allowedExtensions && !this.allowedExtensions.some(ext => ext === file.ext))
    }
}

module.exports = {FilesFilter}