const ignore = require('ignore')

class FilesFilter {

    constructor(ignoredPaths, ignoredDirectories, allowedExtensions) {
        Object.assign(this, {ignoredPaths, ignoredDirectories, allowedExtensions})
    }

    // TODO: use a whitelist instead of a blacklist for ignoredDirectories
    get ignoreFilter() {
        if (!this.ignore) {
            this.ignore = ignore({ignorecase: false})
            if (this.ignoredPaths)
                this.ignore.add(this.ignoredPaths)

            if (this.ignoredDirectories)
                this.ignoredDirectories.forEach(ignoredDirectory => {
                    this.ignore.add(ignoredDirectory + '/**')
                })
        }
        return this.ignore
    }

    isToFilter(file) {
        return this.ignoreFilter.ignores(file.relativePath) ||
            (!!this.allowedExtensions && !this.allowedExtensions.some(ext => ext === file.ext))
    }
}

module.exports = {FilesFilter}