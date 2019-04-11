const fs = require('./async/fs')
const {spawn} = require('child_process')
const path = require('path')
const npmCommand = 'npm'

class Npm {

    constructor(packageDir) {
        Object.assign(this, {packageDir})
    }

    async getOptions() {
        let stats
        try {
            stats = await fs.stat(this.packageDir)
        } catch (error) {
            throw new Error(`Cannot access path "${this.packageDir}"`)
        }

        if (!stats.isDirectory()) {
            throw new Error(`Path "${this.packageDir}" is not a directory`)
        }

        return {
            cwd: this.packageDir,
            env: process.env
        }
    }

    async install() {
        const options = await this.getOptions()
        return await new Promise((resolve, reject) => {
            const npm = spawn(npmCommand, ['install'], options)
            let npmError = ''

            npm.stdout.on('data', data => {
            })

            npm.stderr.on('data', data => {
                npmError += data
            })

            npm.on('close', exitCode => {
                if (exitCode === 0) {
                    resolve('ok')
                } else {
                    reject(npmError)
                }
            })
        })
    }

    async getDevDependencies() {
        const options = await this.getOptions()
        return await new Promise((resolve, reject) => {
            const npm = spawn(npmCommand, ['ls', '-dev', '-parseable'], options)
            let npmOutput = '', npmError = ''

            npm.stdout.on('data', data => {
                npmOutput += data
            })

            npm.stderr.on('data', data => {
                npmError += data
            })

            npm.on('close', exitCode => {
                resolve(this.getDependenciesArray(npmOutput))
                if (exitCode !== 0) {
                    console.error(`Npm has returned the error:\n${npmError}\n` +
                        'The retrieved list of dev dependencies may be incorrect and some of them may be incorrectly added to the package.')
                }
            })
        })
    }

    getDependenciesArray(dependenciesString) {
        return dependenciesString
            .split('\n')
            .filter(path => path !== '' && path !== this.packageDir)
            .map(filePath => path.relative(this.packageDir, filePath))
    }
}

module.exports = Npm