package example.helloWorld;

import bionic.js.BjsProject;
import example.helloWorld.js.HelloWorld;
import jjbridge.engine.v8.V8Engine;

public class Main
{
    static {
        BjsProject.setJsEngine(new V8Engine());
    }

    public static void main(String[] args)
    {
        System.out.println(HelloWorld.hello());
    }
}
