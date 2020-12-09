#if !os(macOS)
import UIKit
#endif

public class BjsBundle {
    
    let bundle: Bundle
    let name: String
    
    public init(_ forClass: AnyClass, _ name: String) {
        self.bundle = Bundle(for: forClass)
        self.name = name
    }
    
    func getFilePath(_ requirePath: String) -> String? {
        let mainBundleFileInfo = BjsFileInfo(requirePath)
        let bundleDir = "\(name).bundle"
        if requirePath == "/" {
            return bundle.path(forResource: bundleDir, ofType: "", inDirectory:"")
        }
        return bundle.path(forResource: mainBundleFileInfo.fullPathWithoutExt, ofType: mainBundleFileInfo.ext, inDirectory:bundleDir)
    }
    
    func loadFile(_ requirePath: String) -> String? {
        do {
            guard let filePath = getFilePath(requirePath) else {
                throw LoadError.Error("error")
            }
            let fileUrl = URL(fileURLWithPath: filePath)
            return try String(contentsOf: fileUrl, encoding: String.Encoding.utf8)
        } catch {
            return nil
        }
    }
    
    private enum LoadError : Error {
        case Error(_ error: String)
    }
}
