package acceptance.toy1;

import acceptance.toy1.bjs.BjsTestProject;
import acceptance.toy1.bjs.UserOfToyComponent1;
import acceptance.toy1.components.ToyComponent1;
import acceptance.toy1.components.ToyComponent2;
import jjbridge.engine.v8.V8Engine;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
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

    @Test
    public void interactingWithSubclass() {
        assertEquals(ToyComponent1.PI() + ToyComponent1.PI(), UserOfToyComponent1.piSum());
    }

    @Test
    public void interactingWithSubclass2() {
        assertEquals(69420, UserOfToyComponent1.additionalValue(new ToyComponent2("0", "0")));
    }

    @Test
    @Disabled
    public void interactingWithSubclass3() {
        // TODO fix
        assertEquals(2, UserOfToyComponent1.getSum2(new ToyComponent2("0", "0"), new ToyComponent1("0", "0")));
        assertEquals(4, UserOfToyComponent1.getSum2(new ToyComponent2("0", "0"), new ToyComponent2("0", "0")));
    }
}
