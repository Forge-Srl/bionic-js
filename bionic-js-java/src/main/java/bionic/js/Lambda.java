package bionic.js;

/**
 * A wrapper interface for function types.
 * */
public interface Lambda
{
    /**
     * A generic function.
     * */
    interface Function
    {
    }

    /**
     * A function which takes no arguments.
     *
     * @param <O> the return type of the function
     * */
    interface F0<O> extends Function
    {
        O apply();
    }

    /**
     * A function which takes 1 argument.
     *
     * @param <I1> the type of the first argument of the function
     * @param <O> the return type of the function
     * */
    interface F1<I1, O> extends Function
    {
        O apply(I1 i1);
    }

    /**
     * A function which takes 2 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <O> the return type of the function
     * */
    interface F2<I1, I2, O> extends Function
    {
        O apply(I1 i1, I2 i2);
    }

    /**
     * A function which takes 3 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <O> the return type of the function
     * */
    interface F3<I1, I2, I3, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3);
    }

    /**
     * A function which takes 4 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <O> the return type of the function
     * */
    interface F4<I1, I2, I3, I4, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4);
    }

    /**
     * A function which takes 5 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <O> the return type of the function
     * */
    interface F5<I1, I2, I3, I4, I5, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5);
    }

    /**
     * A function which takes 6 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <I6> the type of the sixth argument of the function
     * @param <O> the return type of the function
     * */
    interface F6<I1, I2, I3, I4, I5, I6, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6);
    }

    /**
     * A function which takes 7 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <I6> the type of the sixth argument of the function
     * @param <I7> the type of the seventh argument of the function
     * @param <O> the return type of the function
     * */
    interface F7<I1, I2, I3, I4, I5, I6, I7, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7);
    }

    /**
     * A function which takes 8 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <I6> the type of the sixth argument of the function
     * @param <I7> the type of the seventh argument of the function
     * @param <I8> the type of the eighth argument of the function
     * @param <O> the return type of the function
     * */
    interface F8<I1, I2, I3, I4, I5, I6, I7, I8, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8);
    }

    /**
     * A function which takes 9 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <I6> the type of the sixth argument of the function
     * @param <I7> the type of the seventh argument of the function
     * @param <I8> the type of the eighth argument of the function
     * @param <I9> the type of the ninth argument of the function
     * @param <O> the return type of the function
     * */
    interface F9<I1, I2, I3, I4, I5, I6, I7, I8, I9, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8, I9 i9);
    }

    /**
     * A function which takes 10 arguments.
     *
     * @param <I1> the type of the first argument of the function
     * @param <I2> the type of the second argument of the function
     * @param <I3> the type of the third argument of the function
     * @param <I4> the type of the forth argument of the function
     * @param <I5> the type of the fifth argument of the function
     * @param <I6> the type of the sixth argument of the function
     * @param <I7> the type of the seventh argument of the function
     * @param <I8> the type of the eighth argument of the function
     * @param <I9> the type of the ninth argument of the function
     * @param <I10> the type of the tenth argument of the function
     * @param <O> the return type of the function
     * */
    interface F10<I1, I2, I3, I4, I5, I6, I7, I8, I9, I10, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8, I9 i9, I10 i10);
    }
}
