package example.helloWorld.$native$;

import example.helloWorld.js.HelloNativeWorldBjsExport;

public class HelloNativeWorld implements HelloNativeWorldBjsExport {

    public static String hello() {
        return "hello from Java!";
    }
}
