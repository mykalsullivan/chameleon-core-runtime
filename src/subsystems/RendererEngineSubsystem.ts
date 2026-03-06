import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import ARendererBackend from "../renderer/ARendererBackend.ts";
import Queue from "../util/Queue.ts";
import WindowEngineSubsystem from "./WindowEngineSubsystem.ts";
import AssetsEngineSubsystem from "./AssetsEngineSubsystem.ts";

class RendererEngineSubsystem extends AEngineSubsystem
{
    m_Backend: ARendererBackend = null;
    m_CommandBuffer: Queue<DrawCommand> = new Queue<DrawCommand>;

    public constructor(messageChannel: EngineMessageChannel,
                       windowAPI: WindowEngineSubsystem,
                       assets: AssetsEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        // Setup backend or whatever
    }

    public pushCommand(command: DrawCommand): void
    {
        // Could probably use some validation first
        this.m_CommandBuffer.enqueue(command);
    }

    public drawFrame()
    {
        // Not done
        this.m_Backend.draw(this.m_CommandBuffer);
    }
}

export default RendererEngineSubsystem;