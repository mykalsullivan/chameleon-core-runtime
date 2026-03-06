import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class NetworkEngineSubsystem extends AEngineSubsystem
{
    public constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }
}

export default NetworkEngineSubsystem;