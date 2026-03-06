import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class AudioEngineSubsystem extends AEngineSubsystem
{
    constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }
}

export default AudioEngineSubsystem;