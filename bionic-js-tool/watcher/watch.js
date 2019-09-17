const ignore = require('ignore')
const {Configuration} = require('./Configuration')
const path = require('path')
const {GuestWatcher} = require('./GuestWatcher')
const {HostWatcher} = require('./HostWatcher')
const {PackageWatcher} = require('./PackageWatcher')
const {Processor} = require('./Processor')

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0 || args[0].trim() === '') {
        throw new Error('no config file specified')
    }

    const configAbsolutePath = path.resolve(process.cwd(), args[0])
    const config = await Configuration.fromPath(configAbsolutePath)

    const guestWatcher = await GuestWatcher.build(config)
    const guestFiles = await guestWatcher.getInitialFiles()

    const packageWatcher = await PackageWatcher.build(config)
    const packageFiles = await packageWatcher.getInitialFiles()

    const hostWatcher = await HostWatcher.build(config)
    const hostFiles = await hostWatcher.getInitialFiles()

    const processor = new Processor(config, guestFiles, packageFiles, hostFiles)
    const parseQueue = await processor.getParseQueue()

    process.exit()
}

main().catch(err => {
    console.error(err)
    process.exit()
})


/*
  - Nella directory che contiene il file bjs.config.js c'è anche il file .bjs-temp, con dati sullo stato della
    sincronizzazione tra codice guest e host

  - La sincronizzazione consiste nel tener consistenti i file guest con
    - i file package (una copia dei guest eventualmente transpillata)
    - i file host

  - Il processo che controlla i guest e sincronizza, viene eseguito quando è passato almeno 1 secondo dall'ultima
  modifica rilevata. Ogni successiva modifica rilevata viene accodata a gestita dopo il processo con stesse policy.

  - Fasi della sincronizzazione:
  1- Aggiunta file pre-ready
  2- Notifica ready
  3- Modifiche successive

- Gestione pre-ready:
    v- Carico guestSchemas e targetHashes da .bjs-temp
    v- Ottengo gli hash dei guest file pre ready:
        v- guestPaths: [HASH GUEST : PATH GUEST]
        v- guestHashes: [PATH GUEST : HASH GUEST]

    v Per tutti i path in guestHashes
        v Creazione delle target list contenenti tutti i file da creare:
            v packageTargetList: [PACKAGE PATH : GUEST PATH]
            v hostTargetList: [HOST PATH : GUEST PATH]

        v HASH del file guest esiste già in guestSchemas?
                v NO: lo metto nelle
                    v CODA PARSE

    v Per tutti i path nelle target list
        v PATH del file guest esiste nelle targetHashes
            v NO oppure i file al path package/host non esistono o hanno hash diverso
                v lo metto nelle
                    v CODA CREAZIONE PACKAGE
                    v CODA CREAZIONE HOST

    - Gardening
    - Per tutti i file nelle root folder di package e host
        - Se il path NON è presente nelle rispettive target list
            - AGGIUNTA del path nella rispettiva CODA di CANCELLAZIONE
    - Per tutti i guest hashes in guestSchemas
        - Se l'hash NON è presente in guestPaths
            - Rimozione dell'hash da guestSchemas
    - Per tutti i guest path in targetHashes
        - Se il path NON è presente in guestHashes
            - Rimozione dell'hash da targetHashes
    - Eseguo le code


- Gestione modifiche:
    - ADD:
        - HASH esiste già nel processor?
            - SI: utilizzo lo schema esistente nel .bjs-temp
            - NO: AGGIUNTA file guest alla CODA PARSE
        - AGGIUNTA file package alla CODA CREAZIONE PACKAGE
        - AGGIUNTA file host alla CODA CREAZIONE HOST

    - DELETE:
        - AGGIUNTO file package alla CODA CANCELLAZIONE PACKAGE
        - AGGIUNTO file host alla CODA CANCELLAZIONE HOST

- Struttura delle code di esecuzione:
    - PARSE: [GUEST PATH]
    - CREAZIONE PACKAGE: [PACKAGE PATH, GUEST HASH]
    - CREAZIONE HOST: [HOST PATH, GUEST HASH]
    - CANCELLAZIONE PACKAGE: [PACKAGE PATH]
    - CANCELLAZIONE HOST: [HOST PATH]

- Politica esecuzione code:
    - Le code sono in modalità esecuzione?
        - SI: aspetto
    - E' passato almeno 1 sec. dall'ultima modifica recevuta?
        - NO: aspetto
        - SI:
            - Metto le code in modalità esecuzione
            - Per tutti gli elementi della CODA PARSE
                - Parso e aggiungo il file guest al processor
                    guestSchemas: [HASH GUEST : SCHEMA FILE]
                    targetHashes: [PATH GUEST : {HASH PACKAGE, HASH HOST}]
            - Per tutti gli elementi della CODA CANCELLAZIONE PACKAGE
                - Cancello il package
            - Per tutti gli elementi della CODA CANCELLAZIONE HOST
                - Cancello il file host
            - Per tutti gli elementi della CODA CREAZIONE PACKAGE
                - Creo il file package applicando l'eventuale transpill
            - Per tutti  gli elementi della CODA CREAZIONE HOST
                - Creo il file host usando lo schema nel processor
            - Salvo lo stato del processor in .bjs-temp
            - Apetto nuove modifiche tornando al primo punto

- Politica di gestione delle cartelle per i file package e host:
    - ogni cartella rimasta vuota dopo una delete va svuotata
    - ogni cartella non esistente alla creazione di un file verrà creata

*/