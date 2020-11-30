import XCTest

class BjsFileInfoTest: XCTestCase {
    
    override func setUp() {
        super.setUp()
    }
    
    override func tearDown() {
        super.tearDown()
    }
    
    func testProperties() {
        let expectedResults = [
            (fullPath: "module.js", directory:"", fullPathWithoutExt:"module", name:"module.js", nameWithoutExt:"module", ext:"js"),
            (fullPath: "path/module.js", directory:"path", fullPathWithoutExt:"path/module", name:"module.js", nameWithoutExt:"module", ext:"js"),
            (fullPath: "/path/../module.js", directory:"/path/..", fullPathWithoutExt:"/path/../module", name:"module.js", nameWithoutExt:"module", ext:"js"),
            (fullPath: "./module", directory:".", fullPathWithoutExt:"./module", name:"module", nameWithoutExt:"module", ext:""),
            ]
        
        
        for expected in expectedResults {
            let fileInfo = BjsFileInfo(expected.fullPath)
            XCTAssertEqual(fileInfo.fullPath, expected.fullPath)
            XCTAssertEqual(fileInfo.directory, expected.directory)
            XCTAssertEqual(fileInfo.fullPathWithoutExt, expected.fullPathWithoutExt)
            XCTAssertEqual(fileInfo.name, expected.name)
            XCTAssertEqual(fileInfo.nameWithoutExt, expected.nameWithoutExt)
            XCTAssertEqual(fileInfo.ext, expected.ext)
        }
    }
}
