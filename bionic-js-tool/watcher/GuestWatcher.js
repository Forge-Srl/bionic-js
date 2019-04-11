const CodeWatcher = require('./CodeWatcher')
const Npm = require('./Npm')
const FilesFilter = require('./FilesFilter')
const GuestFile = require('./GuestFile')

class GuestWatcher extends CodeWatcher {

    static async build(config) {
        const nodeDep = new Npm(config.guestDir)
        const devDependenciesDirs = await nodeDep.getDevDependencies()
        const guestFilesFilter = new FilesFilter(config.guestIgnores, devDependenciesDirs, GuestFile.extensions)
        return new GuestWatcher(config.guestDir, guestFilesFilter, file => GuestFile.fromFile(file), true)
    }
}

module.exports = GuestWatcher

/*
Dev dependencies
[
  "node_modules/dev-dep",
  "node_modules/dev-dep/node_modules/format",
  "node_modules/dev-dep/node_modules/shared-dep",
  "node_modules/main-dep/node_modules/shared-dep/node_modules/indirect-dep"
]




Package files
[
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/guest1.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/package.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/libs/guest2.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/libs/guest3.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/format/component.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/format/format-min.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/format/format.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/format/package.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/format/test_format.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/indirect-dep/index.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/indirect-dep/package.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/main-dep/index.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/main-dep/package.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/main-dep/node_modules/shared-dep/index.js",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  },
  {
    "path": "/Volumes/H/bjs/bionic/testing-code/guest/node_modules/main-dep/node_modules/shared-dep/package.json",
    "rootDirPath": "/Volumes/H/bjs/bionic/testing-code/guest"
  }
]

* */