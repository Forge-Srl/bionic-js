#if !os(macOS)
import UIKit
#endif

class BjsFileInfo {
    
    private var _directory, _fullPathWithoutExt, _name, _nameWithoutExt, _ext: String?
    let fullPath: String
    
    var directory: String {
        get {
            if _directory == nil {
                splitPath()
            }
            return _directory!
        }
    }
    
    var fullPathWithoutExt: String {
        get {
            if _fullPathWithoutExt == nil {
                splitPath()
            }
            return _fullPathWithoutExt!
        }
    }
    
    var name: String {
        get {
            if _name == nil {
                splitPath()
            }
            return _name!
        }
    }
    
    var nameWithoutExt: String {
        get {
            if _nameWithoutExt == nil {
                splitPath()
            }
            return _nameWithoutExt!
        }
    }
    
    var ext: String {
        get {
            if _ext == nil {
                splitPath()
            }
            return _ext!
        }
    }
    
    func splitPath() {
        let fullPath = self.fullPath as NSString
        let lastPathComponent = fullPath.lastPathComponent as NSString
        
        _directory = fullPath.deletingLastPathComponent
        _fullPathWithoutExt = fullPath.deletingPathExtension
        _name = lastPathComponent as String
        _nameWithoutExt = lastPathComponent.deletingPathExtension
        _ext = fullPath.pathExtension
    }
    
    init(_ fullPath: (String)) {
        self.fullPath = fullPath
    }
}
