const t = require('../test-utils')

describe('bjsCliProgram', () => {

    let getProgram, Bjs, Command, path

    beforeEach(() => {
        Bjs = t.mockAndRequireModule('./Bjs').Bjs
        Command = t.mockAndRequire('commander').Command
        path = t.mockAndRequire('path')
        getProgram = t.requireModule('./cli/bjsCliProgram').getProgram
    })

    test('getProgram', () => {
        const clean = t.mockFn()
        const synchronize = t.mockFn()

        Bjs.version = 'version0000'
        Bjs.info = 'some info'
        Bjs.mockImplementationOnce(log => {
            expect(log).toBe('log')
            return {clean, synchronize}
        })
        path.resolve = (workingDir, pathToResolve) => {
            expect(workingDir).toBe('workingPath')
            expect(pathToResolve).toBe('config path')
            return 'resolvedPath'
        }

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
                    expect(command).toBe('clean <configuration_path>')
                    const result = {
                        description: description => {
                            expect(description).toBe('remove generated JS bundles and native bridging code, based on the given configuration')
                            return result
                        },
                        action: async action => {
                            expect(await action('config path')).toBeUndefined()
                            return result
                        }
                    }
                    return result
                })
                .mockImplementationOnce(command => {
                    expect(command).toBe('sync <configuration_path>')
                    const result = {
                        description: description => {
                            expect(description).toBe('regenerate JS bundles and native bridging code, based on the given configuration')
                            return result
                        },
                        option: (flag, description) => {
                            expect(flag).toBe('-f, --force')
                            expect(description).toBe('force regeneration of all files')
                            return result
                        },
                        action: async action => {
                            expect(await action('config path', {force: 'forceOption', otherOption: 'invalid'})).toBeUndefined()
                            return result
                        }
                    }
                    return result
                })
        }
        Command.mockImplementationOnce(() => programMock)

        const program = getProgram('log', 'workingPath')
        expect(program).toBe(programMock)
        expect(clean).toHaveBeenCalledWith('resolvedPath')
        expect(synchronize).toHaveBeenCalledWith('resolvedPath', 'forceOption')
    })
})