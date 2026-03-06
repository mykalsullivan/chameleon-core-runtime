import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class ClockEngineSubsystem extends AEngineSubsystem
{
    constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }
}

export default ClockEngineSubsystem;