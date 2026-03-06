import AEngineComponent from "../AEngineComponent.ts";
import EngineHostState from "./EngineHostState.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

abstract class AEngineHost extends AEngineComponent
{
    private m_State: EngineHostState = EngineHostState.STOPPED;

    protected constructor(id: number, messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }

    public get getState()
    {
        return this.m_State;
    }

    public setState(state: EngineHostState)
    {
        this.m_State = state;
    }

    public isState(state: EngineHostState): boolean
    {
        return this.m_State === state;
    }

    public abstract start(): Promise<void>;
    public abstract exit(): Promise<void>;
}

export default AEngineHost;