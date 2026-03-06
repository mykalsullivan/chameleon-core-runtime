import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

class EventsEngineSubsystem extends AEngineSubsystem
{
    private m_Listeners: Map<string, EventListener> = new Map();

    constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }

    public add(target: any, type: string, callback: Function): void
    {
        target.addEventListener(type, callback);

        if (!this.m_Listeners.has(type))
            this.m_Listeners.set(type, new Map());

        this.m_Listeners.get(type).set(callback, target);
        this.log(EngineLogLevel.DEBUG, `Added '${type}' listener to target '${target.tagName}' (${callback.name || "anonymous"})`);
    }

    public remove(type, callback): void
    {
        const eventMap = this.m_Listeners.get(type);
        if (!eventMap) return;

        const target = eventMap.get(callback);
        if (!target) return;

        target.removeEventListener(type, callback);
        eventMap.delete(callback);

        if (eventMap.size === 0) this.m_Listeners.delete(type);

        this.log(EngineLogLevel.DEBUG, `Removed '${type}' listener from target '${target.tagName}' (${callback.name || "anonymous"})`);
    }

    public removeAll(): void
    {
        for (const [type, callbacks] of this.m_Listeners)
            for (const callback of [...callbacks.keys()])
                this.remove(type, callback);
        this.log(EngineLogLevel.LOG, "All listeners removed");
    }
}

export default EventsEngineSubsystem;