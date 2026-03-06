import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class DatabaseEngineSubsystem extends AEngineSubsystem
{
    constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }
}

export default DatabaseEngineSubsystem;