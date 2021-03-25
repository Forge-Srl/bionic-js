const t = require('../test-utils')

describe('bjsCliProgram', () => {

    let getProgram, Bjs, bjsInteractiveConfiguration, Command, path

    beforeEach(() => {
        Bjs = t.mockAndRequireModule('./Bjs').Bjs
        bjsInteractiveConfiguration = t.mockAndRequireModule('./cli/bjsInteractiveConfiguration').bjsInteractiveConfiguration
        Command = t.mockAndRequire('commander').Command
        path = t.mockAndRequire('path')
        getProgram = t.requireModule('./cli/bjsCliProgram').getProgram
    })

    test('getProgram', async () => {
        const clean = t.mockFn()
        const synchronize = t.mockFn()
        const initializeConfiguration = t.mockFn()

        Bjs.version = 'version0000'
        Bjs.info = 'some info'
        Bjs.mockImplementationOnce(log => {
            expect(log).toBe('log')
            return {clean, synchronize, initializeConfiguration}
        })
        path.resolve = (workingDir, pathToResolve) => {
            expect(workingDir).toBe('workingPath')
            expect(pathToResolve).toBe('config path')
            return 'resolvedPath'
        }
        bjsInteractiveConfiguration.mockImplementationOnce(async () => 'some config')

        const actionsToCall = []

        const programMock = {
            name: name => {
                expect(name).toBe('bionicjs')
                return programMock
            },
            description: description => {
                expect(description).toBe('some info')
                return programMock
            },
            version: version => {
                expect(version).toBe('version0000')
                return programMock
            },
            command: t.mockFn()
                .mockImplementationOnce(command => {
                    expect(command).toBe('init [configuration_path]')
                    const result = {
                        description: (description, args) => {
                            expect(description).toBe('create a new configuration file interactively')
                            expect(args).toStrictEqual({
                                'configuration_path': 'the place where to store the configuration file'
                            })
                            return result
                        },
                        action: action => {
                            actionsToCall.push(async () => {
                                expect(await action('config path')).toBeUndefined()
                            })
                            return result
                        }
                    }
                    return result
                })
                .mockImplementationOnce(command => {
                    expect(command).toBe('clean <configuration_path>')
                    const result = {
                        description: (description, args) => {
                            expect(description).toBe('remove generated JS bundles and native bridging code, based on the given configuration')
                            expect(args).toStrictEqual({
                                'configuration_path': 'the path to the configuration file'
                            })
                            return result
                        },
                        action: action => {
                            actionsToCall.push(async () => {
                                expect(await action('config path')).toBeUndefined()
                            })
                            return result
                        }
                    }
                    return result
                })
                .mockImplementationOnce(command => {
                    expect(command).toBe('sync <configuration_path>')
                    const result = {
                        description: (description, args) => {
                            expect(description).toBe('regenerate JS bundles and native bridging code, based on the given configuration')
                            expect(args).toStrictEqual({
                                'configuration_path': 'the path to the configuration file'
                            })
                            return result
                        },
                        option: (flag, description) => {
                            expect(flag).toBe('-f, --force')
                            expect(description).toBe('force regeneration of all files')
                            return result
                        },
                        action: action => {
                            actionsToCall.push(async () => {
                                expect(await action('config path', {force: 'forceOption', otherOption: 'invalid'})).toBeUndefined()
                            })
                            return result
                        }
                    }
                    return result
                })
        }
        Command.mockImplementationOnce(() => programMock)

        const program = getProgram('log', 'workingPath')
        expect(program).toBe(programMock)

        // Invoke all actions then check arguments have been passed correctly
        await Promise.all(actionsToCall.map(action => action()))

        expect(initializeConfiguration).toHaveBeenCalledWith('resolvedPath', 'some config')
        expect(clean).toHaveBeenCalledWith('resolvedPath')
        expect(synchronize).toHaveBeenCalledWith('resolvedPath', 'forceOption')
    })
})