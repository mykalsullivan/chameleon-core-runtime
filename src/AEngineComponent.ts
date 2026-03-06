import EngineMessageChannel from "./messages/EngineMessageChannel.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";
import EngineMessage from "./messages/EngineMessage.ts";

abstract class AEngineComponent
{
    private readonly m_ID: number = null;
    private readonly m_MessageChannel: EngineMessageChannel = null;

    protected constructor(id: number, messageChannel: EngineMessageChannel)
    {
        this.m_ID = id;
        this.m_MessageChannel = messageChannel;
    }

    public get id(): number { return this.m_ID; }
    public sendMessage(message: EngineMessage): void
    {
        this.m_MessageChannel.sendMessage(message);
    }

    public log(level: EngineLogLevel, message: string): void
    {
        //const encodedMessage = EngineMessageChannel.encodeMessage(`log.${level}`, {message: message});
        //this.sendMessage(encodedMessage);
    }
}

export default AEngineComponent;