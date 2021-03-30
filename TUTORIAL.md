# Getting started

## Before we start

In this tutorial you will learn how to set up and use bionic.js writing a small HelloWorld app from scratch.

This tutorial is designed for people who prefer to **learn by doing** and doesn't assume any previous knowledge about 
bionic.js. However, we assume you have read [our philosophy](README.md#philosophy) and
[Why should I use bionic.js?](README.md#why-should-i-use-bionicjs) so, at least, you know what bionic.js is about.

Also, we will assume a basic knowledge about JavaScript and at least one between Java and Swift (language and project
setup).

## Setup

You can use any operating system between Windows, Linux and macOS. Please note that, for obvious reasons, the Swift 
project can be handled only on macOS.

If you want to go with the Swift project, we assume you have already installed 
[XCode](https://developer.apple.com/xcode/) and [CocoaPods](https://cocoapods.org/).

If you want to go with the Java project, we assume you have already installed [Maven](https://maven.apache.org/) or 
[Gradle](https://gradle.org/) together with your favorite IDE. If your target is an Android app, just install [Android 
Studio](https://developer.android.com/studio) and you are good to go!

In order to use bionic.js you need [Node.js](https://nodejs.org/en/download/). Node.js will allow you to execute 
bionic.js tool from the command line in order to create the configuration file and to run the code generation process.
Also, it is packed with npm, which comes in handy to manage JavaScript dependencies in your code.

Once you have installed Node.js, open a terminal and run
```shell
npm install -g bionic-js-tool
```
this will download and install the code generation tool for bionic.js.
To check everything is ok, run
```shell
bionicjs -h
```
this should display the help for the `bionicjs` command.

## Overview

Now that you're set up, let's get an overview of bionic.js!

### What is bionic.js?

> Look! Up in the sky!
> 
> It's a Bird...
> 
> It's a Plane...
> 
> It's Superman!

bionic.js is a way to share code between languages by writing it in JavaScript. In order to accomplish this, bionic.js 
is composed by a CLI bundler (the `bionicjs` you installed before) and by a runtime library for each target language 
which allows you to run the JavaScript code together with the generated wrappers.

Basically, you write some JavaScript classes you want to be available in the target projects. Then you annotate the 
methods and properties with the bionic.js comments syntax, and you run the code generation tool. This will make sure to 
create the wrapper classes in your target languages, which will allow you to use the JavaScript classes like all the 
other ones.

### The CLI bundler

`bionicjs` is the command line tool you need to work with bionic.js. It has two main functions:

1. `bionicjs init` to create a new bionic.js configuration file;
2. `bionicjs sync` to run the code generation.

We will dig into the details of both later in the tutorial.

### The runtime libraries

As said before, in order to run the JavaScript code together with the generated code you will need to add a runtime 
library to your project. This runtime library provides an API with a set of core functionalities used by the generated 
code, and it also enables the execution of JavaScript via a proper engine.

Please note that, apart from some startup configuration, you will never need to directly interact with the runtime 
library, i.e. you won't have to write code referencing it. 

## Configuring the project

Now you are ready to start creating your first application with bionic.js.

### Standard folder structure

Since bionic.js is all about multi-language projects, and each project in each language has its own folder structure, we
need to briefly discuss how the several projects (and their folders) should be organized in order to work effectively with 
bionic.js.

Talking about the organization between the projects, the suggested structure is a root project folder (for example 
`MySuperDuperProject`) containing the bionic.js configuration file along with a folder for each language-specific
project.
```
MySuperDuperProject
├─ mySuperDuperProject.bjsconfig.js
├─ MySuperDuperJavascriptProject
│  └─ // Javascript project files here
├─ MySuperDuperJavaProject
│  └─ // Java project files here
└─ MySuperDuperSwiftProject
   └─ // Swift project files here
```

This structure should work whether you are using a VCS or not. It also allows for multiple projects with the same 
language which is possible with advanced configurations of bionic.js.

Regarding each single project, depending on the language here is what we suggest for maximum compatibility with
bionic.js:

- JavaScript: you should use the standard structure for a node module
  ```
  MySuperDuperJavascriptProject
  ├─ package.json
  └─ // source folders, files and other related stuff
  ```
- Swift: you should use the standard XCode project structure
  ```
  MySuperDuperSwiftProject
  ├─ MySuperDuperSwiftProject.xcodeproj
  ├─ MySuperDuperSwiftProject.xcworkspace
  ├─ Podfile
  └─ // source folders, files and other related stuff
  ```
- Java: you should follow the standard directory structure enforced by Maven and Gradle
  ```
  MySuperDuperJavaProject
  ├─ pom.xml // or settings.gradle and build.gradle
  ├─ src
  │  ├─ main
  │  │  └─ java
  │  │     └─ // source folders and files
  │  └─ // other source sets here
  └─ // other related stuff
  ```

### Creating the structure

First, create a `HelloWorld` root folder. This folder will contain all the code for the project.

Then, inside this folder create a new folder `hello-world-js` which will contain the common JavaScript code. Enter in
`hello-world-js` and run
```shell
npm init -y
```
this will create the `package.json` file typical of a node module. If you are not familiar with `npm` you should check
<https://docs.npmjs.com/>.

Now, let's move to the native part. If you are using macOS you can choose between Swift and Java (or even both if you
wish to go multiplatform straight away).

#### Swift

If you chose to go with the Swift project, open XCode to create a new project (bionic.js is compatible with iOS and
macOS applications):
1. For simplicity, choose a macOS "App".
2. Insert "HelloWorldSwift" as Product Name and "bjsExample" as Organization Identifier; also make sure "Swift" is the
   selected Language and "SwiftUI" is the interface.
3. Press next and choose the folder in which to save the project; choose the folder `HelloWorld` previously created.
4. Close XCode and go to `HelloWorld/HelloWorldSwift` and run
   ```shell
   pod init
   ```
   to create the `Podfile`.
5. Edit the `Podfile` to include the bionic.js runtime for Swift:
   ```ruby
   platform :macos, '11.0'

   target 'HelloWorldSwift' do
     # Comment the next line if you don't want to use dynamic frameworks
     use_frameworks!
   
     # Pods for HelloWorldSwift
     pod 'Bionic-js'
   
     target 'HelloWorldSwiftTests' do
       inherit! :search_paths
       # Pods for testing
     end
   
     target 'HelloWorldSwiftUITests' do
       # Pods for testing
     end
   
   end
   ```
6. Then install the dependency by running
   ```shell
   pod install
   ```
7. Now open `HelloWorldSwift.xcworkspace` with XCode and build to check everything is ok.

#### Java

If you chose to go with the Java project, create a `HelloWorldJava` folder inside the `HelloWorld` root folder.
1. Create the folder structure for the Java project:
   - `HelloWorldJava/src`
   - `HelloWorldJava/src/main`
   - `HelloWorldJava/src/main/java`
   - `HelloWorldJava/src/main/resources`
2. Create the project file:
   - If you want to use **Maven**, inside `HelloWorldJava` create a standard `pom.xml` file with the following content:
     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
         <modelVersion>4.0.0</modelVersion>
     
         <groupId>bjs.example</groupId>
         <artifactId>HelloWorldJava</artifactId>
         <version>1.0-SNAPSHOT</version>
     
         <properties>
             <maven.compiler.source>11</maven.compiler.source>
             <maven.compiler.target>11</maven.compiler.target>
         </properties>
     
         <dependencies>
         </dependencies>
     </project>
     ```
   - Otherwise, if you want to use **Gradle**, inside `HelloWorldJava` create a `settings.gradle` file with the following 
     content:
     ```groovy
     rootProject.name = 'HelloWorldJava'
     ```
     and a `build.gradle` file with the following content:
     ```groovy
     plugins {
         id 'java'
     }

     group 'bjs.example'
     version '1.0-SNAPSHOT'
     
     repositories {
         mavenCentral()
     }
     
     dependencies {
     }
     ```
3. Add the bionic.js runtime for Java. The Java runtime leverages [JJBridge](https://github.com/Forge-Srl/jjbridge-api) 
   to execute JavaScript; this means you can choose any of the JavaScript engines supported by that project. For this 
   example we will use `jjbridge-engine-v8` (please choose the right classifier for your platform).
   - In the `pom.xml` file edit the dependencies section:
     ```xml
     <dependencies>
         <dependency>
             <groupId>srl.forge</groupId>
             <artifactId>bionic-js</artifactId>
             <version>0.1.0</version>
         </dependency>
         <dependency>
             <groupId>srl.forge</groupId>
             <artifactId>jjbridge-engine-v8</artifactId>
             <version>0.2.0</version>
             <classifier>macos</classifier>
         </dependency>
     </dependencies>
     ```
   - In the `build.gradle` file edit the dependencies section:
     ```groovy
     dependencies {
         implementation 'srl.forge:bionic-js:0.1.0'
         implementation 'srl.forge:jjbridge-engine-v8:0.2.0:macos'
     }
     ```
4. Create the main file `HelloWorldJava/src/main/java/bjs/example/Main.java` with the following content:
   ```java
   package bjs.example;

   import bionic.js.BjsProject;
   import jjbridge.engine.v8.V8Engine;

   public class Main {
       static {
           BjsProject.setJsEngine(new V8Engine());
       }

       public static void main(String[] args) {
       }
   }
   ```
5. Finally, build to check everything is ok.

### Configuration file

Now that the projects are created, you need the last (but not the least) file: the configuration file for bionic.js.

This file contains all the settings the code generation tool needs in order to find the files to process and to 
synchronize the generated code in the right folders.

To create a configuration file, go to the `HelloWorld` root folder and run
```shell
bionicjs init
```
This will run an interactive wizard to help you set up the minimal configuration for bionic.js. When asked insert the 
following:
- Project name: `HelloWorld`
- Guest JS code root: `./hello-world-js`
- Output mode: development
- BundleName: `Greetings`
- Entry path file for the bundle: `./HelloWorld`
- Then choose the host projects according to which of these you created before (toggle selection pressing space)

If you chose Swift, you will also be asked for:
- XCode project file: `./HelloWorldSwift/HelloWorldSwift.xcodeproj`
- Host directory: `./HelloWorldSwift/Generated`
- Compile the target: `HelloWorldSwift`

If you chose Java, you will also be asked for:
- Project root folder: `./HelloWorldJava`
- Source directory: `src`
- Base package: `bjs.example`
- Package for generated files: `generated`
- Package for wrappers implementation: `wrappers`
- Source set name: `helloworld`

Now, you should have a file `HelloWorld/HelloWorld.bjsconfig.js`. Open it with a text editor and take a moment to 
understand how it is structured:
```javascript
const path = require('path')
const resolve = p => path.resolve(__dirname, p)

module.exports = {
    projectName: 'HelloWorld',
    guestDirPath: resolve('./hello-world-js'),
    guestBundles: {
        Greetings: {
            entryPaths: ['./HelloWorld'],
        },
    },
    outputMode: 'development',
    hostProjects: [{
        language: 'swift',
        projectPath: resolve('./HelloWorldSwift/HelloWorldSwift.xcodeproj'),
        hostDirName: './HelloWorldSwift/Generated',
        targetBundles: {
            Greetings: {
                compileTargets: ['HelloWorldSwift'],
            },
        },
    }, {
        language: 'java',
        projectPath: resolve('./HelloWorldJava'),
        srcDirName: 'src',
        basePackage: 'bjs.example',
        hostPackage: 'generated',
        nativePackage: 'wrappers',
        targetBundles: {
            Greetings: {
                sourceSets: ['helloworld'],
            },
        },
    }],
}
```

Notice the configuration file is just a plain JavaScript file which exports some settings. Among these you can see:
- `guestBundles` which defines the code bundles you want to generate. In this tutorial we will create a single code bundle
  named `Greetings`. Each bundle must declare a set of entry paths which are the files the code generation tool will 
  start from to build the dependency tree and create the JavaScript bundle file.
- `outputMode` which defines how to generate the resulting JavaScript bundle; the allowed values are `production`, 
  `development` and `none`.
- `hostProjects` which defines the set of target projects. In this tutorial you will see only a Java or a Swift project (or 
  both if you chose so). Each language has its own settings, but every host project must define its `targetBundles` 
  which map each guest bundle (notice the same name `Greetings`) to the right compile targets (for Swift) or the right
  source sets (for Java).

You finished the configuration! Now it's all about coding.

## Add a bionic greeting

Go to `HelloWorld/hello-world-js` folder and create a file `HelloWorld.js` with the following content:
```javascript
class HelloWorld {
    
    static greetingsFromJavaScript() {
        return 'Hello World!'
    }
}
module.exports = {HelloWorld}
```
As you can see this is just a class named `HelloWorld` which has only one static method named `greetingsFromJavaScript`.

Then go to `HelloWorld` and run
```shell
bionicjs sync ./HelloWorld.bjsconfig.js
```
The output should tell you that a bundle "Greetings" together with a source file `BjsHelloWorld.java` (or
`BjsGreetings/BjsHelloWorld.swift`) has been created. To see those files you can go to
`HelloWorld/HelloWorldSwift/HelloWorldSwift/Generated/BjsGreetings` (for Swift) or to
`HelloWorld/HelloWorldJava/src/main/resources` and `HelloWorld/HelloWorldJava/src/main/java/bjs/example/generated` (for 
Java).
We won't dig into the details for now, but notice the code generator has just created a JavaScript bundle file and a 
`BjsProject` sub-class.

However, no JavaScript functionality has been exported by now. To do so we need to add a comment to our `HelloWorld.js` 
file:
```javascript
class HelloWorld {
    
    // @bionic () => String
    static greetingsFromJavaScript() {
        return 'Hello World!'
    }
}
module.exports = {HelloWorld}
```
This is a standard single line comment for JavaScript, but it's an important annotation for bionic.js; specifically, 
this annotation tells bionic.js to export the following method that takes no arguments and returns a `String`.
Generally speaking, all bionic.js annotation are comments beginning with `@bionic`. You can annotate classes, methods 
(both static and instance ones) and properties (both static and instance ones). You can refer to the
[documentation](DOCUMENTATION.md) to have a full view of which annotations are available and how to use them.

Run again:
```shell
bionicjs sync ./HelloWorld.bjsconfig.js
```
The output should tell you that the bundle "Greetings" has been updated (we know it should now contain the JavaScript 
class with its exported method) and that a file `HelloWorld.java` (or `HelloWorld.swift`) has been created. This new 
file is the wrapper class which exposes the JavaScript class and its method as a standard class with a standard method 
for the target language.

If you take a look inside this file (`HelloWorld/HelloWorldJava/src/main/java/bjs/example/generated/HelloWorld.java` or 
`HelloWorld/HelloWorldSwift/HelloWorldSwift/Generated/HelloWorld.swift`) you can see a `HelloWorld` class containing, as
expected, a method named `greetingsFromJavaScript`. This means you can now invoke such method simply calling 
`HelloWorld.greetingsFromJavaScript()` from Java (or Swift).

To see this actually works, let's update the target project:
- If you chose Swift, in XCode open the file `ContentView.swift` and change it as follows:
  ```swift
  import SwiftUI
  
  struct ContentView: View {
      var body: some View {
          Text(HelloWorld.greetingsFromJavaScript()!)
              .padding()
      }
  }
  
  struct ContentView_Previews: PreviewProvider {
      static var previews: some View {
          ContentView()
      }
  }
  ```
- If you chose Java, edit the file `Main.java` as follows:
  ```java
  package bjs.example;
  
  import bionic.js.BjsProject;
  import bjs.example.generated.HelloWorld;
  import jjbridge.engine.v8.V8Engine;
  
  public class Main {
      static {
          BjsProject.setJsEngine(new V8Engine());
      }
  
      public static void main(String[] args) {
          System.out.println(HelloWorld.greetingsFromJavaScript());
      }
  }
  ```
  
Now, if you build and run the target project, you should see the message "Hello World!" appear.

## Improve the bionic greeting

Ok, now that everything is working, it's time for a small improvement in our greeting. Let's allow passing a name to 
greet.

First, edit the `HelloWorld.js` file:
```javascript
class HelloWorld {
    
    // @bionic (String) => String
    static greetingsFromJavaScript(name) {
        return `Hello ${name}!`
    }
}
module.exports = {HelloWorld}
```
As you can see, now the method takes an argument, therefore we must update the annotation accordingly;
`@bionic (String) => String` represents a method taking a `String` parameter in and returning a `String` result.

Run again:
```shell
bionicjs sync ./HelloWorld.bjsconfig.js
```
The output should tell you that `HelloWorld.java` (or `HelloWorld.swift`) has been updated.

Now go to the target project and update it to pass a name to the `greetingsFromJavaScript` method:
- If you chose Swift
  ```swift
  // ...
  struct ContentView: View {
      var body: some View {
          Text(HelloWorld.greetingsFromJavaScript("Alice")!)
              .padding()
      }
  }
  // ...
  ```
- If you chose Java
  ```java
  // ...
  public static void main(String[] args) {
      System.out.println(HelloWorld.greetingsFromJavaScript("Alice"));
  }
  // ...
  ```

Build and run the target project one last time, and you should see the message "Hello Alice!" appear.

## Wrapping up

Whoa, you made it to the end!

In this tutorial you learnt how to organize a multiplatform project with bionic.js from scratch and how to generate a 
simple configuration file. Then, you saw how to expose a method in a JavaScript class in order to use it in a target 
project written in Swift or Java.

### Where to go from here?

As you have seen, once the configuration phase is done, is all about writing JavaScript code, annotate it properly and 
sync the target project(s) to reference it.

You are ready to use bionic.js in your next project!

However, we suggest you to check out the [documentation](DOCUMENTATION.md) for a deeper understanding of how bionic.js 
works and what you can do with it (specifically all the available annotations).