package acceptance.toy1;

import acceptance.toy1.bjs.BjsTestProject;
import acceptance.toy1.bjs.UserOfToyComponent1;
import acceptance.toy1.components.ToyComponent1;
import jjbridge.engine.v8.V8Engine;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ToyComponent1Test
{
    @BeforeAll
    public static void beforeClass()
    {
        BjsTestProject.setJsEngine(new V8Engine());
    }

    @Test
    public void testWrapped_getSum() {
        ToyComponent1 wrapped = new ToyComponent1("1", "2");
        assertEquals(6, wrapped.getSum(3));
    }

    @Test
    public void testWrapped_getToySum() {
        ToyComponent1 wrapped1 = new ToyComponent1("1", "2");
        ToyComponent1 wrapped2 = new ToyComponent1("3", "4");
        assertEquals(10, wrapped2.getToySum(wrapped1));
    }

    @Test
    public void testFromJs_sameInstance() {
        ToyComponent1 toy = new ToyComponent1("1", "2");
        UserOfToyComponent1.lastToy(toy);
        assertEquals(toy, UserOfToyComponent1.lastToy());
    }
}
