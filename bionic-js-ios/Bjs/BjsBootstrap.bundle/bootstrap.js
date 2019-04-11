/**
 * @license Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */
function bootstrap(nativeImports) {
    const nodeJsPath = loadNodeJsPath();
    const nodeJsIntenalModule = loadNodeJsInternalModule();
    return loadNodeJsModule(nodeJsIntenalModule, nodeJsPath);
    
    function loadNodeJsPath() {
        
        const modulePath = '/node_lib/path.js';
        
        const requireFunctionShim = function(request) {
            switch(request) {
                case 'internal/errors':
                    return {
                        TypeError : class NodeError extends TypeError {
                            constructor(errCode, argName, expectedType, actualObject) {
                                if (errCode === 'ERR_INVALID_ARG_TYPE')
                                    super(`Error: type for argument "${argName}" should be "${expectedType}"`);
                                else
                                    super(`Unknown node error code: "${errCode}"`);
                            }
                        }
                    };
                default:
                    requireShimNotSupported(request, modulePath);
            }
        };
        
        const exports = {};
        const module = { exports : exports };
        const moduleGlobals = [['require', requireFunctionShim],
                               ['process', { platform: 'darwin', env: {}, cwd: () => '/' }],
                               ['exports', exports],
                               ['module', module]];
        
        nativeImports.executeFile(modulePath, moduleGlobals);
        return module.exports;
    }
    
    function loadNodeJsInternalModule() {
        
        const modulePath = '/node_lib/internal.module.js';
        
        const processBindingShim = function(bindName) {
            switch(bindName) {
                case 'config':
                    return { exposeHTTP2: false }
                default:
                    processBindingShimNotSupported(bindName, modulePath);
            }
        };
        
        const exports = {};
        const module = { exports : exports };
        const moduleGlobals = [['process', { binding: processBindingShim, mainModule: null }],
                               ['exports', exports],
                               ['module', module]];
        
        nativeImports.executeFile(modulePath, moduleGlobals);
        return module.exports;
    }
    
    function loadNodeJsModule(nodeJsIntenalModule, nodeJsPath) {
        
        const modulePath = '/node_lib/module.js';
        
        const requireFunctionShim = function(request) {
            switch(request) {
                case 'native_module':
                    return { wrapper: null, wrap: null, nonInternalExists: nativeImports.isInternalModule,
                        require: nativeImports.getInternalModule };
                case 'util':
                    return { debuglog: () => (function() {}) };
                case 'assert':
                    return { ok: assertShim };
                case 'path':
                    return nodeJsPath;
                case 'internal/module':
                    return nodeJsIntenalModule;
                case 'fs':
                    return { readFileSync : nativeImports.readFile };
                case 'vm':
                case 'internal/fs':
                    return null;
                default:
                    requireShimNotSupported(request, modulePath);
            }
        };
        
        const assertShim = function(condition, message) {
            if (!condition)
                throw message ? message : 'assertion failed'
                }
        
        const processBindingShim = function(bindName) {
            switch(bindName) {
                case 'fs':
                    return { internalModuleStat: nativeImports.fileStat, internalModuleReadFile: nativeImports.readFile }
                case 'config':
                    return { preserveSymlinks: true } // Symlinks are preserved while caching and requiring
                default:
                    processBindingShimNotSupported(bindName, modulePath);
            }
        };
        
        const exports = {};
        const module = { exports : exports };
        const moduleGlobals = [['require', requireFunctionShim],
                               ['process', {
                                platform: 'darwin',
                                env: { HOME: null, NODE_PATH: null },
                                emitWarning: function(warning) { console.error(warning); },
                                execPath: '/bjs/lib/node',
                                binding: processBindingShim
                                }],
                               ['exports', exports],
                               ['module', module],
                               ['executeContent', nativeImports.executeContent]];
        
        const tailCode =
        'modulePaths = [];\n' +
        'Module.globalPaths = [];\n' +
        'delete Module._extensions[".node"];\n' +
        `Module.prototype._compile = ${getCompileModuleFunction().toString()};`;
        
        nativeImports.executeFile(modulePath, moduleGlobals, tailCode);
        return module.exports;
    }
    
    function getCompileModuleFunction() {
        
        return function(fileContent, filePath) {
            
            fileContent = internalModule.stripShebang(fileContent);
            const requireFunction = internalModule.makeRequireFunction(this);
            const depth = internalModule.requireDepth;
            const dirPath = path.dirname(filePath);
            if (depth === 0) stat.cache = new Map();
            
            const globals = [['module', this],
                             ['exports', this.exports],
                             ['require', requireFunction],
                             ['__filename', filePath],
                             ['__dirname', dirPath]];
            executeContent(fileContent, filePath, globals);
            
            if (depth === 0) stat.cache = null;
        };
    }
    
    function requireShimNotSupported(request, modulePath) {
        throw `NodeJS module "${request}" is not supported (executing file "${modulePath}")`;
    }
    
    function processBindingShimNotSupported(bindName, modulePath) {
        throw `NodeJS process.binding("${bindName}") is not supported (executing file "${modulePath}")`
    }
}
