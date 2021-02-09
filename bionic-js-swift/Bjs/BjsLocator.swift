public class BjsLocator {
    
    let projectName, moduleName: String
    
    private var _bjs: Bjs!
    
    public init(_ projectName: String, _ moduleName: String) {
        self.projectName = projectName
        self.moduleName = moduleName
    }
    
    public convenience init() {
        self.init("", "")
    }
        
    var isInvalid: Bool {
        projectName == "" || moduleName == ""
    }
    
    var get: Bjs {
        if _bjs == nil {
            _bjs = Bjs.get(projectName)
        }
        return _bjs
    }
}
