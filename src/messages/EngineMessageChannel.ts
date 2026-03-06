import EngineMessage from "./EngineMessage.ts";
import EngineMessageChannelImpl from "./EngineMessageChannelImpl.ts";
import EngineMessageDispatcherImpl from "./EngineMessageDispatcherImpl.ts";

class EngineMessageChannel
{
    private readonly m_Impl: EngineMessageChannelImpl = null;
    private readonly m_DispatcherImpl: EngineMessageDispatcherImpl = null;

    public constructor(impl: EngineMessageChannelImpl, dispatcherImpl: EngineMessageDispatcherImpl)
    {
        this.m_Impl = impl;
        this.m_DispatcherImpl = dispatcherImpl;
    }

    public encodeMessage(type: string, payload: {}): EngineMessage
    {
        // Placeholder stuff
        const encodedType: number = 0;
        const encodedPayloadLen: number = 0;
        const encodedPayload: Int32Array = new Int32Array;
        return {
            type: encodedType,
            payloadLen: encodedPayloadLen,
            payload: encodedPayload
        };
    }

    public get numericID(): number
    {
        return 0; // Placeholder
    }

    public sendMessage(message: EngineMessage): void
    {
        this.m_DispatcherImpl.enqueue(message);
    }
}

export default EngineMessageChannel;