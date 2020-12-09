package acceptance.toy1.components;

import acceptance.toy1.bjs.ToyComponent1BjsExport;
import acceptance.toy1.bjs.ToyComponent2BjsExport;

public class ToyComponent2 extends ToyComponent1 implements ToyComponent2BjsExport
{
    public static Double PI2()
    {
        return Math.PI + 3;
    }

    public ToyComponent2(String number1, String number2)
    {
        super(number1, number2);
    }

    @Override
    public Integer getSum(Integer offset)
    {
        return super.getSum(offset) * 2;
    }

    @Override
    public Integer getToySum(ToyComponent1BjsExport toyComponent1)
    {
        return getSum(1) + toyComponent1.getSum(1);
    }

    @Override
    public Integer additionalMethod()
    {
        return 69420;
    }
}
