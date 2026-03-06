import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class FilesystemEngineSubsystem extends AEngineSubsystem
{
    public constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }

    public open(path: string, flags: any): void
    {

    }

    public close(fd: number): void
    {

    }
}

export default FilesystemEngineSubsystem;