# bionic.js

![Build bionic.js Tool](https://github.com/Forge-Srl/bionic-js/workflows/Build%20Bionic.js%20Tool/badge.svg?branch=main)

![Build bionic.js Java](https://github.com/Forge-Srl/bionic-js/workflows/Build%20Bionic.js%20Java/badge.svg?branch=main)

![Build bionic.js Swift](https://github.com/Forge-Srl/bionic-js/workflows/Build%20Bionic.js%20Swift/badge.svg?branch=main)

bionic.js let you use JavaScript classes from other programming languages without using any framework and without writing a single line of bridging code.

1. write standard JavaScript code
2. add type annotations for some JS classes and methods
3. use these JS classes and methods from other languages like Java and Swift


```javascript
/* HelloJsWorld.js - JS reusable code */

export class HelloJsWorld {
    
    // @bionic String
    static get hello() {
        return "Hello from JavaScript"
    }
}
```

```java
/* main.java - Java code */

public static void main (String[] args) {
  System.out.println(HelloJsWorld.hello()) // Yes, I'm using the JS class from Java!
}
```

```swift
/* ContentView.swift - iOS code */

import SwiftUI

struct ContentView: View {
    var body: some View {
        Text(HelloJsWorld.hello!) // Yes, I'm using the JS class from Swift!
            .padding()
    }
}
```

## Table of Contents

- [Full Documentation](DOCUMENTATION.md)
- [Philosophy](#philosophy)
- [Why should I use bionic.js?](#why-should-i-use-bionicjs)
- [Installation](#Installation)
  - [CLI bundler](#cli-bundler)
  - [Swift (iOS/macOS)](#swift-iOSmacOS)
  - [Java (Android and JVM)](#java-android-and-jvm)
- [Usage](#usage)
- [Supported languages](#supported-languages)
- [License](#license)


## Philosophy

Instead of providing *yet another cross-platform app development framework*, bionic.js focuses on the **interoperability between JavaScript and other programming languages**, starting from languages used for the development of native apps.

Writing native applications requires every aspect, including business logic, to be implemented twice in different languages such as Java or Swift. 
The same business logic is often written again a third time for a web application.
The reuse of code between different languages is very limited and leads to several well-known problems.

On the other hand cross-platform app development frameworks enable great code reuse across platforms, but they are not loved by all developers as they force almost all the application code to be written in a common language such as JavaScript, C# or Dart, using a set of third party APIs not officially supported and maintained by each platform vendor.
 
bionic.js loves both native application development and code reuse, leaving the native app developer the freedom to decide which code to reuse, when to do it, and how to do it.


## Why should I use bionic.js?

- [X] to keep an application truly native, maintainable by any native app developer
- [X] to choose precisely which business logic I want to reuse between Android, iOS, backend and web apps
- [X] to keep the codebase independent of a third party cross-platform app development framework
- [X] to keep using native application tools and languages in order to develop and optimize every critical part (e.g. UI, multimedia, camera, sensors, GPU, crypto, biometrics, notifications, ...)
- [X] to avoid writing and maintaining tons of bridging code between JavaScript and compiled code
- [X] to keep trying all the new features offered by the latest versions of Android, iOS, macOS right away
- [X] to keep using a large number of available and widely tested native libraries, also from JS code
- [X] to put only the necessary code in the app binary, keeping the final package size under control
- [X] to incrementally extract and reuse business logic from existent native apps without having to rewrite everything from scratch.


## Installation

Coming soon!
<!-- TODO: uncomment when everything have been deployed
bionic.js consists of a CLI bundler and a small library for each supported native language.


### CLI bundler

bionic.js bundler requires [node](https://nodejs.org/en/download/), once node is installed run

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
-->

## Usage

```shell
bionicjs config-file.js
```

example

```console
foo@bar:~$ bionicjs hello-world.bjsconfig.js

bionic.js - v1.0.1

Analyzing guest files dependencies
Extracting schemas from guest files
Generating bundles
Opening Swift host project
Writing bundles
Writing host files
Writing Swift host project

Project files
 [+] Bundle "MainBundle"
 [+] Source "BjsMainBundle/BjsHelloJsWorld.swift" - in bundles (MainBundle)
 [+] Source "HelloJsWorld.swift" - in bundles (MainBundle)
 [+] Source "HelloNativeWorldBjsWrapper.swift" - in bundles (MainBundle)
 [+] Source "HelloWorld.swift" - in bundles (MainBundle)
 ----------
 [-] deleted : 0
 [U] updated : 0
 [+] added : 5

Processing time: 0.88s
```

## Supported languages

Here is a list of the native languages currently supported by bionic.js:
- **Java** (Android + JVM, on Windows, macOS and Linux)
- **Swift** (iOS and macOS)
- Bonus: JVM-based languages (Kotlin, Groovy, Scala, ...)
- Bonus: Objective-C, thanks to the Swift-Objective-C interoperability.

bionic.js is open to the integration of new native languages and environments.


## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
