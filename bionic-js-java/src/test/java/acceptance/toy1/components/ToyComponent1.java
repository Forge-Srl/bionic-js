package acceptance.toy1.components;

import acceptance.toy1.bjs.ToyComponent1BjsExport;

public class ToyComponent1 implements ToyComponent1BjsExport
{
    private String number1;
    private String number2;

    public static Double PI()
    {
        return Math.PI;
    }

    public static Integer sum(Integer number1, Integer number2) {
        return number1 + number2;
    }

    public ToyComponent1(String number1, String number2)
    {
        this.number1 = number1;
        this.number2 = number2;
    }

    @Override
    public Integer number1()
    {
        return Integer.parseInt(number1);
    }

    @Override
    public void number1(Integer value)
    {
        number1 = value.toString();
    }

    @Override
    public Integer number2()
    {
        return Integer.parseInt(number2);
    }

    @Override
    public void number2(Integer value)
    {
        number2 = value.toString();
    }

    @Override
    public Integer getSum(Integer offset)
    {
        return offset + number1() + number2();
    }

    @Override
    public Integer getToySum(ToyComponent1BjsExport toyComponent1)
    {
        return getSum(0) + toyComponent1.getSum(0);
    }
}
