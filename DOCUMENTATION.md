# Documentation

- [Terminology](#terminology)
- [Architecture](#architecture)
- [Principles and standards](#principles-and-standards)
  - [ECMAScript 6 classes](#ecmascript-6-classes)
  - [Named exports](#named-exports)
  - [Annotations](#annotations)
  - [Source files](#source-files)
  - [No default API](#no-default-api)
- [Annotation types](#annotation-types)
  - [Primitive types](#primitive-types)
  - [Array](#array)
  - [Lambda](#lambda)
  - [JsRef](#jsref)
  - [Class](#class)
    - [JsClass](#jsclass)
    - [NativeClass](#nativeclass)
- [Annotation placement](#annotation-placement)
    - [Above the class](#above-the-class)
    - [Above the function](#above-the-function)
    - [Free within the class](#free-within-the-class)
- [Project configuration](#project-configuration)

## Terminology
For simplicity this documentation calls *native code* the code written with the programming language used in the development of native applications (e.g. Java for Android, Swift for iOS and macOS).

## Architecture
The architecture of bionic.js is straight forward, the JS code is compiled with [webpack](https://webpack.js.org) and provided as a bundle along with the aplication.
When the native code uses a JS class it is actually using a native class defined in the auto-generated bridging code. Auto-generated classes exploit the bionic.js library to communicate with the JavaScript runtime, in order to execute the JS bundle, instantiate the proper JS class, call functions, methods and so forth.

```
+-------------------------------------+-------------------------------------+
|                                     |                                     |
| Native App                          | App Business Logic                  |
| (Java, Swift, ...)                  | (webpack JS Bundle)                 |
|                                     |                                     |
|                                     |                                     |
|         +---------------------------+                                     |
|         |                           |                                     |
|         | bionic.js Bridging Code   |                                     |
|         |                           |                                     |
|         | (Auto-generated Java,     |                                     |
|         |  Swift, ...)              |                                     |
|         |                           |                                     |
|         +---------------------------+---------------------------+         |
|         |                                                       |         |
|         | bionic.js Library                                     |         |
|         | (C++, Java, Swift, ...)                               |         |
|         |                                                       |         |
+---------+---------------------------+---------------------------+---------+
|                                     |                                     |
| Native Runtime                      | JavaScript Runtime                  |
| (JVM, ART, Swift/ObjC, ...)         | (V8, JavaScriptCore, ...)           |
|                                     |                                     |
+-------------------------------------+-------------------------------------+
|                                                                           |
| Operating System (Android, iOS, iPadOS, macOS, Windows, Linux, ...)       |
|                                                                           |
+---------------------------------------------------------------------------+

```
<!---
http://asciiflow.com for the diagram
-->

The execution efficiency of the JS code is very good since the JS runtime is provided by state of the art JS engines, usually V8 on Android/Windows/Linux and JavaScriptCore on iOS/MacOS. 

Calling JS methods from native code and vice versa implies an exchange of data between the native code and the JS runtime, for this reason the bionic.js library was specifically designed to be efficient, e.g. automatic bridging code generation is always preferred over the use of code introspection/reflection.

## Principles and standards
To effectively share JavaScript (JS) business logic with native code, projects using bionic.js follow some principles and embrace some standards.

### ECMAScript 6 classes
Interoperable JS code should be written using ECMAScript 6 (ES6) classes.

```javascript
/* Message.js (ready to be annotated) */
class Message {

    constructor(text) {
        this.text = text
    }

    get formatted() {
        return `The message is "${this.text}"`
    }
}
```
Static methods can be used to export plain JS functions or values
```javascript
/* Calculations.js (ready to be annotated) */
class Calculations {

    static sum(number1, number2) {
        return number1 + number2
    }

    static sqrt(number) {
        return Math.sqrt(number)
    }

    static get pi() {
        return Math.PI
    }
}
```
Constructor can be used to export anonymous JS objects
```javascript
/* Configuration.js (before being annotated) */
class Configuration {

    constructor() {
        this.protocol = "https"
        this.address = "api.example.com"
        this.port = 443
        this.timeout = 60
    }
}
```

The mandatory use of ES6 classes applies only to the JS code that needs to be exported and actually interact with native code; code that is not meant to be exported does not have to meet this requirement.

### Named exports
A JS class should be exported as an object property (named export).
```javascript
class Message {}

// CommonJS
module.exports = {Message}

// ES6
export {Message}

// ES6 inline
export class Message { ... }
```
Please note that to use a class exported with a named export, a named import should be employed.
```javascript
// CommonJS
const {Message} = require("./Message")

// ES6
import {Message} from "./Message"
```
Other ways of exporting classes, perfectly valid in JS, are not yet supported by bionic.js.
```javascript
module.exports = class Message {} // UNSUPPORTED
export default class Message {} // UNSUPPORTED

class Message {}

module.exports = Message // UNSUPPORTED
export default Message // UNSUPPORTED    
```

As for ES6 classes, also this requirement applies only to the JS code that must be exported to native code.


### Annotations
JS is a dynamically typed language, which means type checking happens at run time and the source code doesn't provide any information about the type of variables or parameters. However, languages such as Java and Swift are statically typed and require type information to be provided at source code level.
Annotations are just JS comments with a very simple syntax, can be [placed](#annotation-placement) above the class, the method or the property to allow the developer to provide type information.

```javascript
/* Message.js */
export class Message {

    // @bionic (String)
    constructor(text) {
        this.text = text
    }

    // @bionic String
    get formatted() {
        return `The message is "${this.text}"`
    }
}

/* Calculations.js */
export class Calculations {

    // @bionic (Float, Float) => Float
    static sum(number1, number2) {
        return number1 + number2
    }

    // @bionic (Float) => Float
    static sqrt(number) {
        return Math.sqrt(number)
    }

    // @bionic Float
    static get pi() {
        return Math.PI
    }
}

/* Configuration.js */
export class Configuration {

    // @bionic
    constructor() {
        this.protocol = "https"
        this.address = "api.example.com"
        this.port = 443
        this.timeout = 60
    }

    // @bionic get protocol String
    // @bionic get address String
    // @bionic get port Int
    // @bionic get timeout Int
}
```
bionic.js allows JS classes to be used in native code as if they were native classes.

```java
/* example.java */

Message message = new Message("Hello world")
System.out.println(message.formatted()) // prints The message is "Hello world"

System.out.println(Calculations.sum(40, Calculations.sqrt(4))) // prints 42

Configuration config = new Configuration()
System.out.println(config.protocol + "://" + config.address) // prints https://api.example.com
```

```swift
/* example.swift */

let message = Message("Hello world")
print(message.formatted) // prints The message is "Hello world"

print(Calculations.sum(40, Calculations.sqrt(4))) // prints 42

let config = Configuration()
print("\(config.protocol)://\(config.address)") // prints https://api.example.com
```

### Source files
Each JS file should contain only one annotated class.

```javascript
/* Hello.js */

// @bionic
class Hello {
    // OK, Hello is exported in native code
}

class World {
    // OK, World is NOT exported in native code
}

// @bionic
class Wheel {
    // UNSUPPORTED, Wheel must be put in another file
}

// This file is considered invalid for bionic.js even without the export directives
```

### No default API
JS code running in bionic.js by default cannot access any API other than the standard language functionalities included in the ES6 standard. However the developer can easily declare any set of APIs and then implements them in native code, without writing a single line of bridging code.

The main principle of bionic.js is to keep the set of APIs accessible from JS as small and as independent as possible from the underlying platform.
As a rule of thumb, if a particular function needs to be aware of the underlying platform, it should be implemented in native code and only the independent part should be exposed as an API for JS code. In this way it is possible to maintain an excellent separation between the reusable JS logic and the native one.

Suppose the JS business logic has to make HTTPS GET requests, the developer can simply declare the JS class `HttpGetRequest`, mark it with the annotation `@bionic native` and then implement it in native code using her favorite native library available for each platform.  

```javascript
/* HttpGetRequest.js */

// @bionic native
export class HttpGetRequest {
    
    // @bionic (String)
    constructor(url) {
    }

    // @bionic ((error: String, response: String) => Void) => Void
    send(callback) {
    }
}
```
`HttpGetRequest` class, marked with `@bionic native` is just a "stub class" which only defines the interface of a native class. The native environment running this JS code (e.g. Android and iOS app) provides the actual implementation in native code of `HttpGetRequest` class, with method signatures corresponding to those indicated in the JS "stub class". 
`HttpGetRequest.js` can now simply be imported and used by JS code, as if it were a standard JS class.

```javascript
/* example.js */

import {HttpGetRequest} from "./HttpGetRequest.js"

const request = new HttpGetRequest("https://myapi.com/message")
// The implementation of HttpGetRequest class is in native code, Java or Swift, depending on the platform on which this JS code runs.

request.send((error, message) => { 
    if (error) {
        console.error(error)
    } else {
        console.log(message)
    }
})
```
`example.js` uses the native implementation of `HttpGetRequest` provided by the native platform hosting the JS code. Each implementation of `HttpGetRequest` is written using native code and offers a minimal but consistent functionality between the different platforms. The developer can therefore optimize the native part of the application keeping the JS code platform-independent and therefore highly reusable.

To speed up the implementation of native classes as much as possible, bionic.js automatically generates native class scaffolds for each `@bionic native` "stub class" specified by the developer.

```java
/* HttpGetRequest.java scaffold */

class HttpGetRequest implements HttpGetRequestBjsExport {
    
    public HttpGetRequest(String url) {
        
    }
    
    public void send(Lambda.F2<String, String, Void> callback) {
        
    }
}
```

```swift
/* HttpGetRequest.swift scaffold */

import Bjs

class HttpGetRequest: BjsExport {
    
    init(_ url: String?) {
        
    }
    
    func send(_ callback: ((_ error: String?, _ response: String?) -> Void)?) {
        
    }
}
```

## Annotation types
In order to be interoperable with native code, JS class constructor, methods and properties should have annotations reporting the proper type for each parameter. 
Annotations are plain JS comments with a simple syntax that bionic.js can recognize and parse.

BJS offers a minimal set of types that allows the developer to effectively export most of the functionalities from JS to native languages and viceversa.

More formally, a type is defined as follows (<a href="https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form" target="_blank">Extended Backus–Naur form</a>):

```ebnf
type = primitive-type | array-type | lambda-type | jsref-type | class-type ;
```

where each of these type categories is defined in the following sections.

Bjs requires that classes, methods, properties and parameters, to be interoperable with native code, have names consisting of characters in the ranges `[a ... z]`, `[A ... Z]`, `[0 ... 9]`, and the first character must not be a digit. A name defined in this way is called `identifier` and is formally defined as follows:

```ebnf
digit = "0" | ... | "9" ;
letter = "a" | ... | "z" | "A" | ... | "Z" ;
identifier = letter , { letter | digit } ;
```

### Primitive types
The primitive types supported by bionic.js are:
- **Bool**, in JS as in native code is the boolean type.
    ```javascript 
    // @bionic Bool
    get boolValue() { return true }
    ```
- **Date**, in JS is the `Date` class, in native code is the standard class used to represent the date.
    ```javascript 
    // @bionic Date
    get dateValue() { return new Date(2012, 11, 21) }
    ```
- **Float**, in JS is the `Number` type, in native code is a floating point with double precision. 
    ```javascript 
    // @bionic Float
    get floatValue() { return 2.718 }
    ```
- **Int**, in JS is the `Number` type, in native code is a 64bit signed integer (non-integer JS values are rounded to the nearest integer in the native runtime). 
    ```javascript 
    // @bionic Int
    get intValue() { return 420 }
    ```
- **String**, in JS is the `String` type, in native code is the standard type used to represent a string.
    ```javascript 
    // @bionic String
    get stringValue() { return 'Colorless green ideas sleep furiously' }
    ```
- **Void**, can be used only in method and lambda annotations to mark the absence of a return type. In these cases it can always be omitted, also omitting the arrow.
    ```javascript 
    // @bionic (() => Void) => Void
    doAsyncTask(completedCallback) { setTimeout(completedCallback, 5000) }
    ```
    the above annotation can be shortened with
    ```javascript 
    // @bionic (())
    doAsyncTask(completedCallback) { setTimeout(completedCallback, 5000) }
    ```

Formally:
```ebnf
primitive-type = "Bool" | "Date" | "Float" | "Int" | "String" | "Void" ;
```

### Array
Array type is supported by bionic.js using the notation `Array<SomeType>` where `SomeType` can be any type supported by bionic.js.
```javascript 
    // @bionic Array<Int>
    get ages() { return [18, 33, 69, 100] }

    // @bionic Array<Array<Float>>
    get weightTable() { return [[15.9, -0.003], [-4.2, 0, 714.0062]] }
```

Formally:
```ebnf
array-type = "Array<" , type , ">" ;
```

### Lambda
The lambda type is used to represent an unnamed function.
It is specified by a pair of round brackets `()` followed by an optional arrow `=>`. The function parameters are inside the two brackets, separated by commas.  
```javascript 
    // @bionic () => Void
    get callbackFunc() { return () => {} }

    // @bionic (Float) => Float
    get incrementFunc() { return n => n + 1 }
    
    // @bionic (Float, Float) => Float
    get sumFunc() { return (a, b) => a + b }
```

Each parameter must contain its type specifier which can optionally be preceded by the name of the parameter followed by a colon, eg. `text: String`.  

```javascript 
    // @bionic (number1: Float, number2: Float) => Float
    get sumFunc() { return (a, b) => a + b }
```
The return value is specified after the arrow, if the arrow is omitted the function is considered to have `Void` return value type.
```javascript 
    // @bionic ()
    get callbackFunc() { return () => {} }
```

A lambda type can be used as parameter or return type within another lambda type.
```javascript 
    // @bionic () => (Float) => Float
    get funcReturningIncrementFunc() { return () => n => n + 1 }
```

Formally:
```ebnf
parameter = [ identifier , ":" ] , type ;
lambda-type = "(" , [ parameter , { "," , parameter } ] , ")" , [ "=>" , type ] ;
```

### JsRef
The `JsRef` type is used to store a reference to a JS object in the native environment. The native code cannot use any functionality of an object of this type, it can only keep a reference to it and then pass it back to the JS code.
```javascript 
// Server.js
export class Server

    // @bionic () => JsRef
    static start() { 
        const id = setInterval(() => { 
            ... 
        }, 1000);
        return { id }
    }

    // @bionic (JsRef)
    static stop(handle) {
        clearInterval(handle.id)
    }
}
```

```java
/* example.java */

BjsAnyObject serverHandle = Server.start()
Server.stop(serverHandle)
```

```swift
/* example.swift */

let serverHandle = Server.start()
Server.stop(serverHandle)
```

Formally:
```ebnf
jsref-type = "JsRef" ;
```

### Class
Class type allows the developer to pass JS or native objects to the native environment and viceversa, it can be specified just using the class name itself such as `Message` or `HttpGetRequest`.
Class type is used to reference a JS or a native object, call its functionalities (constructor, methods and properties) from JS code as well as from native code, running on different native platforms.
Although using the Class type with bionic.js is very simple and everything works like magic, it's good to know that under the hood there are two different categories of class types.

Formally:
```ebnf
class-type = identifier ;
```

#### JsClass
- is an instance of a JS class
- “lives” in JS
- has an implementation written in JS
- its JS class has at least one `@bionic` annotation

```javascript 
// @bionic (String) => Message
getMessage(text) { 
    return new Message(text) 
}
```
The previous code exports a JsClass object because the JS `Message` class has `@bionic` annotations.

#### NativeClass
- is an instance of a native class
- “lives” in the native environment
- has an implementation written in native code (a different one for each supported native platform)
- has a JS "stub class" marked with the `@bionic native` annotation

```javascript 
// @bionic (String) => HttpGetRequest
getRequest(url) { 
    return new HttpGetRequest(url) 
}
```
The previous code exports a NativeClass object because the JS `HttpGetRequest` "stub class" is marked with the `@bionic native` annotation.

## Annotation placement
bionic.js annotations can be placed in three different locations: above the `class` keyword, above the constructor/property/method and in any place within the `class` block.

### Above the class
The annotation can be of 2 kinds:
- `@bionic` marks a JS class to be available to native code.
- `@bionic native` defines a JS "stub class" containing the interface of a native class that will be accessible by JS code.

A JS class can be made interoperable with native code by adding the `@bionic` annotation above the `class` keyword.

```javascript
// @bionic
export class Message {

    get text() {
        return "Hello there"
    }
}
```

The `text` property is still not accessible to the native code however, since the `Message` class is marked with `@bionic` (JsClass type) it is therefore possible to pass the reference to a `Message` instance to the native code and then pass it back to JS.

```javascript
// @bionic native
export class Camera {

    // @bionic (() => Photo)
    takePhoto(callback) { 
        // no implementation
    }
}
```
The `@bionic native` annotation requires that a `Camera` native class is available in each native environment. `Camera` is now a NativeClass type, its functions have bionic.js annotations but no JS implementation, their implementations are in native code and are therefore platform dependent.

*Be careful, if the `@bionic native` annotation above the class is missing and other functions are annotated, the class type is defaulted to JsClass instead of NativeClass.*

Formally:
```ebnf
above-the-class-annotation = "@bionic" | "@bionic native" ;
```

### Above the function
To make a class function (constructor, property or method) interoperable with native code, add the proper `@bionic` annotation followed by the type definition above the function itself, e.g. `@bionic String`

For getters and setters, the type refers to the type of the property.

```javascript
export class Message {

    // @bionic String
    get text() {
        return this._text
    }

    // @bionic String
    set text(value) {
        this._text = value
    }
}
```

The `text` property is now fully accessible (getter and setter) to the native code.  
As an annotation has been added inside the class, the `@bionic` annotation above the `class` keyword is no longer required (however it can be still specified).

Constructor and methods are functions, so the `type` is always a lambda type, containing information on the type of parameters and return value.


```javascript
export class Message {

    // @bionic (String)
    constructor(text) {
        this._text = text
    }

    // @bionic () => String
    getText() {
        return this._text
    }

    // @bionic (String)
    setText(value) {
        this._text = value
    }
}
```

The class now has a constructor accessible from native code, taking a `String` parameter. The `text` property is also accessible from native code through two methods.

Formally:
```ebnf
above-the-function-annotation = "@bionic " , type ;
```

### Free within the class
It can happen that a method (or a property) is not explicitly declared in the class body, for this cases bionic.js provides a specific syntax where `@bionic` is followed by the method specifier, the method name and the type, eg: `@bionic static method getText () => String`.
For method annotations it is mandatory to specify the name of the parameters in the lambda type.

```javascript
export class Message {

    // bionic (String)
    constructor(text) {
        this.text = text
    }

    // @bionic static method concat (msg1: Message, msg2: Message) => Message
    // @bionic get set text String
    // @bionic method getFormattedText () => String
}

Message.concat = function(msg1, msg2) {
    return new Message(`${msg1} ${msg2}`)
}

Message.prototype.getFormattedText = function() {
    return `text is: "${this.text}"`
}
```

The static method `concat`, as well as the instance method `getFormattedText`, can be annotated despite not having been declared within the class body using the ES6 syntax.
`text` is a class field and can interoperate with native code without having explicit getter and a setter functions.

Formally:
```ebnf
method-modifier = "static " ;
method-kind = "method " | "get " | "set " | "get set " ;
method-name = identifier ;
free-within-class-annotation = "@bionic " , [ method-modifier ] , method-kind , method-name , type ;
```

## Project configuration
A project using bionic.js requires these three components:
- entry point to `.js` class files
- native application projects
- bionic.js configuration file

The entry point can be one or more `.js` files, it serves bionic.js to build the JS dependency graph and create, leveraging webpack, the JS bundle containing all the business logic. Among the `.js` files reached by the dependency graph there must be files exporting classes with `@bionic` annotations, these classes can then be used by the native code.

Native application projects are parsed by bionic.js, which will add or update where required JS bundles and bridging code needed to use the JS classes directly from the native code. Currently JVM Java, Android, iOS and macOS projects are supported.

The bionic.js configuration file is a regular `.js` file that exports an object containing all the information required to create JS bundles and generate native bridging code in native application projects. Below is an example of the file, with comments explaining the various information required.


```javascript
/* hello-world.bjsconfig.js */

const path = require('path')

module.exports = {

    /* unique name of the bionic.js projet */
    projectName: "HelloJsWorld", 

    /* absolute path of the directory where the JS business logic files are located */
    guestDirPath: path.resolve(__dirname, "./js"),

    /* key is the name of JS bundle, value is the configuration */
    guestBundles: {
        MainBundle: { 
            /* the paths of the entry files for the MainBundle, relative to the guestDirPath */
            entryPaths: ['./HelloWorld'],
        },
    },

    /* JS bundle type, can be "production" (minimized) or "development" (optimized for debugging) */
    outputMode: "development",

    /* contains objects with the configurations of all native application projects  */
    hostProjects: [{
        /* the application project is written in Swift (Xcode project) */
        language: "swift",

        /* absolute path of the application project file */
        projectPath: path.resolve(__dirname, "./swift/HelloJsWorld.xcodeproj"),

        /* name of the directory where the Swift bridging code is auto-generated  */
        hostDirName: "Bjs",

        /* key is the name of JS bundle, value is the configuration */
        targetBundles: {
            MainBundle: {
                /* the auto-generated Swift files for the MainBundle should have these compilation targets */
                compileTargets: ["HelloJsWorld (iOS)", "HelloJsWorld (macOS)"],
            },
        },
    }, {
        /* the application project is written in Java */
        language: "java",

        /* absolute path of the application project root directory */
        projectPath: path.resolve(__dirname, "./java"),

        /* name of the project directory that contains the Java source files */
        srcDirName: "src",

        /* base package used by application Java source files */
        basePackage: "example.helloWorld",

        /* sub-package to use by auto-generated Java bridging code */
        hostPackage: "js",
        
        /* sub-package which contains implementation of native wrappers */
        nativePackage: "wrappers",

        /* key is the name of JS bundle, value is the configuration */
        targetBundles: {
            MainBundle: {
                /* the auto-generated Java source files for the MainBundle should be placed in these sourceSets */
                sourceSets: ["example"],
            }
        }
    }],
}
```
