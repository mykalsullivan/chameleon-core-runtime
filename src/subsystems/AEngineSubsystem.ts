import AEngineComponent from "../AEngineComponent.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

abstract class AEngineSubsystem extends AEngineComponent
{
    protected constructor(id: number, messageChannel: EngineMessageChannel)
    {
        super(id, messageChannel);
    }
}

export default AEngineSubsystem;