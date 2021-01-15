package bionic.js;

import jjbridge.api.runtime.JSReference;
import jjbridge.api.value.JSFunction;

import java.util.HashSet;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

final class TimeoutHandler
{
    private final ScheduledExecutorService scheduler;
    private final HashSet<Integer> timeoutIds;
    private final AtomicInteger lastTimeoutId;

    TimeoutHandler(int startingId)
    {
        this.scheduler = Executors.newScheduledThreadPool(1);
        this.timeoutIds = new HashSet<>();
        this.lastTimeoutId = new AtomicInteger(startingId);
    }

    synchronized int newTimeoutId()
    {
        int timeoutId = lastTimeoutId.incrementAndGet();
        timeoutIds.add(timeoutId);
        return timeoutId;
    }

    boolean exists(int timeoutId)
    {
        return timeoutIds.contains(timeoutId);
    }

    void remove(int timeoutId)
    {
        timeoutIds.remove(timeoutId);
    }

    int runDelayed(JSFunction<?> function, JSReference functionReference, int delay)
    {
        int timeoutId = newTimeoutId();
        scheduler.schedule(() ->
        {
            if (exists(timeoutId))
            {
                function.invoke(functionReference);
                remove(timeoutId);
            }
        }, delay, TimeUnit.MILLISECONDS);
        return timeoutId;
    }
}
