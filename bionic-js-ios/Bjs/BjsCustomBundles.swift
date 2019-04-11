/**
 * Copyright (c) Forge Srl - All Rights Reserved
 * Unauthorized copying, distribution, alteration, transmission or other use of this file is strictly prohibited
 */

import UIKit
import Foundation

public class BjsCustomBundles {
    
    private var customBundles : [String : Bundle]
    
    init() {
        customBundles = [String : Bundle]()
    }
    
    public func add(bundleName: String, bundle: Bundle) {
        
        customBundles[bundleName] = bundle
    }
    
    func getPath(requirePath: String) -> String? {
        
        if customBundles.isEmpty {
            return nil
        }
        let bundleFileInfo = BjsCustomBundleFileInfo(requirePath)
        if bundleFileInfo.isCustomBundlePath {
            let fileInfo = bundleFileInfo.inBundleFileInfo!
            return customBundles[bundleFileInfo.customBundleName!]?.bundleURL.appendingPathComponent("\(bundleFileInfo.customBundleName!).bundle").appendingPathComponent(fileInfo.fullPath).path
        }
        return nil
    }
}
