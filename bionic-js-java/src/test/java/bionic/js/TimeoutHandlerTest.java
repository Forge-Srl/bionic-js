package bionic.js;

import jjbridge.api.value.JSFunction;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;

public class TimeoutHandlerTest {
    private static final int startingId = 15;
    private TimeoutHandler timeoutHandler;

    @BeforeEach
    public void before() {
        timeoutHandler = new TimeoutHandler(startingId);
    }

    @Test
    public void timeoutId_lifecycle() {
        for (int i = 0; i < 100; i++) {
            assertFalse(timeoutHandler.exists(startingId + 1 + i));
            assertEquals(startingId + 1 + i, timeoutHandler.newTimeoutId());
            assertTrue(timeoutHandler.exists(startingId + 1 + i));

            if (i % 2 == 0) {
                timeoutHandler.remove(startingId + 1 + i);
                assertFalse(timeoutHandler.exists(startingId + 1 + i));
            }
        }
    }

    @Test
    public void runDelayed_singleInvocation() throws InterruptedException {
        int[] value = new int[1];

        JSFunction<?> function = mock(JSFunction.class);
        doAnswer(invocation -> {
            value[0] = 2;
            return null;
        }).when(function).invoke(null);

        int id = timeoutHandler.runDelayed(function, null, 1000);

        assertNotEquals(2, value[0]);
        assertTrue(timeoutHandler.exists(id));
        Thread.sleep(1500);
        assertEquals(2, value[0]);
        assertFalse(timeoutHandler.exists(id));
    }

    @Test
    public void runDelayed_multipleInvocation() throws InterruptedException {
        int[] value = new int[] {0};
        final int increment = 5;
        final int n = 35;
        final int delay = 140;

        JSFunction<?> function = mock(JSFunction.class);
        doAnswer(invocation -> {
            value[0] += increment;
            return null;
        }).when(function).invoke(null);

        for (int i = 1; i <= n; i++) {
            assertEquals(startingId + i, timeoutHandler.runDelayed(function, null, delay * i));
        }

        assertEquals(0, value[0]);
        Thread.sleep(delay / 4);
        assertEquals(0, value[0]);
        for (int i = 1; i <= n; i++) {
            assertTrue(timeoutHandler.exists(startingId + i));
            Thread.sleep(delay);
            assertEquals(increment * i, value[0]);
            assertFalse(timeoutHandler.exists(startingId + i));
        }
    }

    @Test
    public void runDelayed_remove() throws InterruptedException {
        int[] value = new int[] {0};

        JSFunction<?> function = mock(JSFunction.class);
        doAnswer(invocation -> {
            value[0] = 999;
            return null;
        }).when(function).invoke(null);

        int id = timeoutHandler.runDelayed(function, null, 500);

        assertEquals(0, value[0]);
        assertTrue(timeoutHandler.exists(id));
        Thread.sleep(100);
        assertEquals(0, value[0]);
        assertTrue(timeoutHandler.exists(id));
        Thread.sleep(100);
        assertEquals(0, value[0]);
        assertTrue(timeoutHandler.exists(id));
        Thread.sleep(100);
        assertEquals(0, value[0]);
        assertTrue(timeoutHandler.exists(id));
        Thread.sleep(100);
        assertEquals(0, value[0]);
        assertTrue(timeoutHandler.exists(id));
        timeoutHandler.remove(id);
        assertFalse(timeoutHandler.exists(id));
        Thread.sleep(300);
        assertEquals(0, value[0]);
        assertFalse(timeoutHandler.exists(id));
    }
}
