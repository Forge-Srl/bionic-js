# Bionic.js

Bionic.js let you share the business logic between different native languages without using any framework and without writing a single line of bridging code.

1. write code once in JavaScript (ECMAScript 6)
2. annotate classes to be exported
3. use JS classes from native code (eg. Android and iOS), as if they were native classes

```javascript
// HelloJsWorld.js
module.exports = class HelloJsWorld {
    
    // @bionic String
    static get hello() {
        return "Hello from JavaScript"
    }
}
```

```swift
// ContentView.swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text(HelloJsWorld.hello!)
            .padding()
    }
}

```

## Philosophy

Bionic.js focuses on a single simple thing: **interoperability between native code and reusable JavaScript code**.


Writing native applications requires every aspect, including business logic, to be implemented in a native code such as Java or Swift. 

On the other hand cross-platform development frameworks require all application code to be written in a common language such as JavaScript, C# or Dart.
 
Bionic.js loves both code reuse and native code, leaving the developer the freedom to decide which code to reuse, when to do it, and how to do it.

## Why should I use Bionic.js?

- [X] to have a truly native application 
- [X] to reuse a lot of business logic between Android, iOS and web apps
- [X] to write native code in order to optimize some critical parts
- [X] to avoid writing tons of bridge code between JavaScript and native code
- [X] to use the official UI tooling
- [X] to use the official API for native stuffs like camera, sensors, notifications
- [X] to try all the new features offered by the latest versions of Android and iOS right away
- [X] to keep the entire codebase independent of a third party framework

Example: I already have a native app, I want to incrementally extract all the business logic and reuse it for other mobile+web apps without having to rewrite the whole codebase from scratch.


## Installation

Bionic.js consists of a CLI bundler and a small library for each supported native language.


### CLI bundler

Bionic.js bundler requires [node](https://nodejs.org/en/download/), once node is installed run

```bash
npm install -g bionicjs
```


### Swift (iOS/macOS)

Add the following row to your `Podfile`
```ruby
pod "BionicJS"
```
and run
```bash
pod install 
```


### Java (Android and JVM)

Add this to your pom.xml
```xml
<dependency>
  <groupId>srl.forge</groupId>
  <artifactId>bionicjs</artifactId>
  <version>0.1.1</version>
</dependency>
```


## Usage

```shell
bionicjs ./my-config-file.js
```

example

```console
foo@bar:~$ bionicjs ./hello-js-world-config.js

Bionic.js - v1.0.1

Analyzing guest files dependencies
Extracting schemas from guest files
Generating bundles
Opening Swift host project
Writing bundles
Writing host files
Writing Swift host project

Project files
 [+] Bundle "BusinessLogic"
 [+] Source "BjsBusinessLogic/BjsHelloBjs.swift" - in bundles (BusinessLogic)
 [+] Source "HelloJsWorld.swift" - in bundles (BusinessLogic)
 ----------
 [-] deleted : 0
 [U] updated : 0
 [+] added : 3

Processing time: 0.12s
```

## Config file

```javascript
module.exports = {
    projectName: "HelloBjs",
    guestDirPath: "/absolute/path/to/js/src,
    guestBundles: {
        BusinessLogic: { 
            entryPaths: ['./HelloJsWorld.js'],
        },
    },
    outputMode: "development",
    hostProjects: [{
        language: "swift",
        projectPath: "/absolute/path/to/HelloJsWorld.xcodeproj",
        hostDirName: "BjsCode",
        targetBundles: {
            BusinessLogic: {
                compileTargets: ["HelloJsWorld"],
            },
        },
    }],
}
```

## Supported languages

Here is a list of the native languages currently supported by Bionic.js:
- **Java** (Android + JVM, on Windows, macOS and Linux)
- **Swift** (iOS and macOS)
- Bonus: JVM-based languages (Kotlin, Groovy, Scala, ...)
- Bonus: Objective-C, thanks to the Swift-Objective-C interoperability.

Bionic.js is open to the integration of new native languages and environments.


## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
