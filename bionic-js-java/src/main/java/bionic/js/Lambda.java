package bionic.js;

public interface Lambda
{
    interface Function
    {
    }

    interface F0<O> extends Function
    {
        O apply();
    }

    interface F1<I1, O> extends Function
    {
        O apply(I1 i1);
    }

    interface F2<I1, I2, O> extends Function
    {
        O apply(I1 i1, I2 i2);
    }

    interface F3<I1, I2, I3, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3);
    }

    interface F4<I1, I2, I3, I4, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4);
    }

    interface F5<I1, I2, I3, I4, I5, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5);
    }

    interface F6<I1, I2, I3, I4, I5, I6, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6);
    }

    interface F7<I1, I2, I3, I4, I5, I6, I7, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7);
    }

    interface F8<I1, I2, I3, I4, I5, I6, I7, I8, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8);
    }

    interface F9<I1, I2, I3, I4, I5, I6, I7, I8, I9, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8, I9 i9);
    }

    interface F10<I1, I2, I3, I4, I5, I6, I7, I8, I9, I10, O> extends Function
    {
        O apply(I1 i1, I2 i2, I3 i3, I4 i4, I5 i5, I6 i6, I7 i7, I8 i8, I9 i9, I10 i10);
    }
}
