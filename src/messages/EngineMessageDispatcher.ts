import AEngineComponent from "../AEngineComponent.ts";
import EngineMessageDispatcherImpl from "./EngineMessageDispatcherImpl.ts";
import EngineMessageChannelImpl from "./EngineMessageChannelImpl.ts";
import EngineMessageChannel from "./EngineMessageChannel.ts";
import EngineMessage from "./EngineMessage.ts";
import EngineLookupSystem from "../lookup/EngineLookupSystem.ts";

class EngineMessageDispatcher extends AEngineComponent
{
    private readonly m_Impl: EngineMessageDispatcherImpl = null;

    private static createDispatcherChannel(channelImpl: EngineMessageChannelImpl,
                                           dispatcherImpl: EngineMessageDispatcherImpl): EngineMessageChannel
    {
        return new EngineMessageChannel(channelImpl, dispatcherImpl);
    }

    public constructor(lookupSystem: EngineLookupSystem)
    {
        const dispatcherImpl = new EngineMessageDispatcherImpl(lookupSystem);
        const id: string = "Message Dispatcher";
        const channelImpl: EngineMessageChannelImpl = dispatcherImpl.createChannel(id);
        const numID: number = channelImpl.getNumID();
        super(numID, EngineMessageDispatcher.createDispatcherChannel(channelImpl, dispatcherImpl));
        this.m_Impl = dispatcherImpl;
    }

    public createChannel(id: string): EngineMessageChannel
    {
        const channelImpl: EngineMessageChannelImpl = this.m_Impl.createChannel(id);
        return new EngineMessageChannel(channelImpl, this.m_Impl);
    }

    public removeChannel(id: string): void
    {
        this.m_Impl.removeChannel(id);
    }

    public enqueue(message: EngineMessage): void
    {
        this.m_Impl.enqueue(message);
    }

    public clear(): void
    {
        this.m_Impl.clear();
    }

    public flush(): void
    {
        this.m_Impl.flush();
    }

    public subscribe(id: string, subscriber: any): void
    {
        this.m_Impl.subscribe(id, subscriber);
    }

    public unsubscribe(id: string): void
    {
        this.m_Impl.unsubscribe(id);
    }
}

export default EngineMessageDispatcher;