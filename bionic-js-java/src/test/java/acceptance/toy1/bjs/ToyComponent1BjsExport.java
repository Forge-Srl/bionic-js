package acceptance.toy1.bjs;

import bionic.js.*;
import jjbridge.api.value.strategy.FunctionCallback;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public abstract class ToyComponent1BjsExport implements BjsExport
{
    public static final Bjs bjs = BjsNativeWrapperTypeInfo.get(Wrapper.class).bjsLocator.get();

    public ToyComponent1BjsExport(String number1, String number2) {}

    public abstract Integer number1();
    public abstract void number1(Integer value);

    public abstract Integer number2();
    public abstract void number2(Integer value);

    public abstract Integer getSum(Integer offset);
    public abstract Integer getToySum(ToyComponent1BjsExport toyComponent1);

    @BjsTypeInfo.BjsLocation(project = "TestProject", module = "ToyComponent1")
    public static final class Wrapper extends BjsNativeWrapper<ToyComponent1BjsExport>
    {
        private static Class<? extends ToyComponent1BjsExport> realImplementation;
        public static <T extends ToyComponent1BjsExport> void registerImplementation(Class<T> implementation)
        {
            if (realImplementation != null)
            {
                throw new RuntimeException("ToyComponent1BjsExport implementation already registered");
            }
            realImplementation = implementation;
        }

        @BjsNativeWrapperTypeInfo.Exporter
        public static void bjsExportFunctions(BjsNativeExports nativeExports) {
            nativeExports
                    .exportFunction("bjsStaticGet_pi", bjsStaticGet_pi())
                    .exportFunction("bjsStatic_sum", bjsStatic_sum())
                    .exportFunction("bjsGet_number1", bjsGet_number1())
                    .exportFunction("bjsSet_number1", bjsSet_number1())
                    .exportFunction("bjsGet_number2", bjsGet_number2())
                    .exportFunction("bjsSet_number2", bjsSet_number2())
                    .exportFunction("bjs_getSum", bjs_getSum())
                    .exportFunction("bjs_getToySum", bjs_getToySum())
                    .exportBindFunction(bjsBind());
        }

        private static FunctionCallback<?> bjsBind() {
            return jsReferences -> {
                ToyComponent1BjsExport bound = bjs.getBound(jsReferences[1], realImplementation);
                if (bound == null) {
                    bound = invokeConstructor(
                            new Class[]{String.class, String.class},
                            new Object[]{bjs.getString(jsReferences[1]), bjs.getString(jsReferences[2])});
                }
                bjs.bindNative(bound, jsReferences[0]);
                return bjs.jsUndefined();
            };
        }

        private static FunctionCallback<?> bjsStaticGet_pi() {
            return jsReferences -> bjs.putPrimitive((Double) invokeStatic("PI", new Class[0], new Object[0]));
        }

        private static FunctionCallback<?> bjsStatic_sum() {
            return jsReferences -> {
                Integer result = invokeStatic("sum",
                        new Class[]{Integer.class, Integer.class},
                        new Object[]{bjs.getInteger(jsReferences[0]), bjs.getInteger(jsReferences[0])});
                return bjs.putPrimitive(result);
            };
        }

        private static FunctionCallback<?> bjsGet_number1() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number1());
        }
        private static FunctionCallback<?> bjsSet_number1() {
            return jsReferences -> {
                ((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number1(bjs.getInteger(jsReferences[1]));
                return bjs.jsUndefined();
            };
        }

        private static FunctionCallback<?> bjsGet_number2() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number2());
        }
        private static FunctionCallback<?> bjsSet_number2() {
            return jsReferences -> {
                ((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).number2(bjs.getInteger(jsReferences[1]));
                return bjs.jsUndefined();
            };
        }

        private static FunctionCallback<?> bjs_getSum() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).getSum(bjs.getInteger(jsReferences[1])));
        }

        private static FunctionCallback<?> bjs_getToySum() {
            return jsReferences -> bjs.putPrimitive(((ToyComponent1BjsExport) bjs.getWrapped(jsReferences[0])).getToySum(bjs.getWrapped(jsReferences[1])));
        }

        private static <R> R invokeStatic(String name, Class<?>[] types, Object[] args) {
            try
            {
                Method method = realImplementation.getMethod(name, types);
                return (R) method.invoke(realImplementation, args);
            }
            catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e)
            {
                return null;
            }
        }

        private static ToyComponent1BjsExport invokeConstructor(Class<?>[] types, Object[] args) {
            try
            {
                Constructor<? extends ToyComponent1BjsExport> constructor = realImplementation.getConstructor(types);
                return constructor.newInstance(args);
            }
            catch (NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e)
            {
                return null;
            }
        }
    }
}


