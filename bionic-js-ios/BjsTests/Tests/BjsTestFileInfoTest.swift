import XCTest

class BjsCustomBundleFileInfoTest: XCTestCase {
    
    override func setUp() {
        super.setUp()
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testGetTestRequirePath() {
        
        XCTAssertEqual(BjsCustomBundleFileInfo.getRequirePath("testBundle", "internal/path/test.js"), "/_bundle_/testBundle/internal/path/test.js")
    }
    
    func testProperties() {
        
        let expectedResults = [
            (fullPath: "", isCustomBundlePath: false, customBundleName: nil, inBundleFileInfo: nil),
            (fullPath: "module.js", isCustomBundlePath: false, customBundleName: nil, inBundleFileInfo: nil),
            (fullPath: "_bundle_/module.js", isCustomBundlePath: false, customBundleName: nil, inBundleFileInfo: nil),
            (fullPath: "/_bundle_/module.js", isCustomBundlePath: true, customBundleName: "module.js", inBundleFileInfo: "/"),
            (fullPath: "/_bundle_/module", isCustomBundlePath: true, customBundleName: "module", inBundleFileInfo: "/"),
            (fullPath: "/_bundle_/module/", isCustomBundlePath: true, customBundleName: "module", inBundleFileInfo: "/"),
            (fullPath: "/_bundle_/module/file.js", isCustomBundlePath: true, customBundleName: "module", inBundleFileInfo: "/file.js"),
            ]
        
        for expected in expectedResults {
            let fileInfo = BjsCustomBundleFileInfo(expected.fullPath)
            XCTAssertEqual(fileInfo.isCustomBundlePath, expected.isCustomBundlePath)
            XCTAssertEqual(fileInfo.customBundleName, expected.customBundleName)
            XCTAssertEqual(fileInfo.inBundleFileInfo?.fullPath, expected.inBundleFileInfo)
        }
    }
}

