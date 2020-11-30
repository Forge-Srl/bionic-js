/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

public class BjsLocator {
    
    let projectName, moduleName: String
    
    private var _bjs: Bjs!
    private static var _projects = [String : Bjs]()
    
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
