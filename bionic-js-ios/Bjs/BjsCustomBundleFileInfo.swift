/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit

public class BjsCustomBundleFileInfo {
    
    private static let customBundlePrefix : String = "_bundle_"
    
    let fullPath: String
    private var _isCustomBundlePath: Bool?
    private var _customBundleName: String?
    private var _inBundleFileInfo: BjsFileInfo?
    
    public static func getRequirePath(_ bundleName: String, _ inBundlePath: String) -> String {
        
        return "/\(customBundlePrefix)/\(bundleName)/\(inBundlePath)"
    }
    
    var isCustomBundlePath: Bool {
        get {
            if _isCustomBundlePath == nil {
                splitCustomBundlePaths()
            }
            return _isCustomBundlePath!
        }
    }
    
    var customBundleName: String? {
        get {
            if _customBundleName == nil {
                splitCustomBundlePaths()
            }
            return _customBundleName
        }
    }
    
    var inBundleFileInfo: BjsFileInfo? {
        get {
            if _inBundleFileInfo == nil {
                splitCustomBundlePaths()
            }
            return _inBundleFileInfo
        }
    }
    
    func splitCustomBundlePaths() {
        
        let components = fullPath.components(separatedBy: "/")
        if components.count < 3 || components[1] != BjsCustomBundleFileInfo.customBundlePrefix {
            _isCustomBundlePath = false
            return;
        }
        
        _isCustomBundlePath = true
        _customBundleName = components[2]
        
        if components.count == 3 {
            _inBundleFileInfo = BjsFileInfo("/")
        } else {
            _inBundleFileInfo = BjsFileInfo(String(fullPath.suffix(fullPath.count - (BjsCustomBundleFileInfo.customBundlePrefix.count + 2 + _customBundleName!.count))))
        }
    }
    
    init(_ fullPath: (String)) {
        
        self.fullPath = fullPath
    }
}

