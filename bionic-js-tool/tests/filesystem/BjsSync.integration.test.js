const t = require('../test-utils')

describe('Bjs integration', () => {

    let BjsSync, DebugLog

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
    })

    /*

    test('sync', async () => {
        const bjsSync = new BjsSync(t.getModuleAbsolutePath('testing-code/bjs.config.js'), new DebugLog())
        await bjsSync.sync()
    })


    test('pbxproj parser', () => {
        // Se la directory esiste
        //   SI: controlla se è vuota
        //      SI: copia i file e crea il file bjs.lock
        //      NO, ma contiene il file bjs.lock
        //          svuoto la directory e copio i file
        //      NO, ma non contiene il file bjs.lock
        //          errore
        //   NO: creo su HDD le cartelle e dei gruppi con path corrispondente
        //       copia i file e crea il file bjs.lock

        const xcode = require('xcode')
        const fs = require('fs')
        const projectPath = '/users/marcovanetti/Repos/lunch-ios/ForLunch.xcodeproj/project.pbxproj'
        const projectParser = xcode.project(projectPath)
        const project = projectParser.parseSync()
        const firstProjectObj = project.getFirstProject()
        const mainGroup = project.getPBXGroupByKey(firstProjectObj.firstProject.mainGroup)

        const group = findGroup('ForLunch/BjsFather2/Bjs', project, mainGroup)


        group.//projectParser.addSourceFile('ForLunch/Bjs/foo.swift', {}, group)
        fs.writeFileSync('/users/marcovanetti/Repos/lunch-ios/project_mod.pbxproj', projectParser.writeSync())
        console.log('end')
    })

     */
})