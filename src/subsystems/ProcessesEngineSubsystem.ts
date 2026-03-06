import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageDispatcher from "../messages/EngineMessageDispatcher.ts";
import EngineSubsystemBridge from "./EngineSubsystemBridge.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EngineRuntimeProcessHost from "../hosts/EngineRuntimeProcessHost.ts";
import EngineProcessHost from "../hosts/EngineProcessHost.ts";
import AssetsEngineSubsystem from "./AssetsEngineSubsystem.ts";
import AEngineHost from "../hosts/AEngineHost.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

class ProcessesEngineSubsystem extends AEngineSubsystem
{
    private m_ProcessRegistry: Map<string, EngineProcessHost> = new Map();
    private m_MessageDispatcher: EngineMessageDispatcher = null;
    private m_AssetsAPI: AssetsEngineSubsystem = null;

    public constructor(messageChannel: EngineMessageChannel,
                       messageDispatcher: EngineMessageDispatcher,
                       assets: AssetsEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_MessageDispatcher = messageDispatcher;
        this.m_AssetsAPI = assets;
    }

    public createRuntimeProcess(messageDispatcher: EngineMessageDispatcher,
                                subsystems: EngineSubsystemBridge,
                                gamePath: string): EngineRuntimeProcessHost
    {
        const messageChannel: EngineMessageChannel = messageDispatcher.createChannel("Engine");
        return new EngineRuntimeProcessHost(messageChannel, subsystems, gamePath);
    }

    public async createProcess(processID: string, wasmURL: string): Promise<boolean>
    {
        if (this.m_ProcessRegistry.has(processID))
        {
            this.log(EngineLogLevel.WARN, `Process '${processID}' already exists`);
            return;
        }
        this.log(EngineLogLevel.INFO, `Starting process ${processID}...`);

        // Resolve the WASM module to pass into the hosts
        const wasmModule: WebAssembly.Module = this.m_AssetsAPI.getWasmModule(wasmURL);
        if (!wasmModule)
            throw new Error(`Failed to load module '${wasmURL}'`);

        const messageChannel: EngineMessageChannel = this.m_MessageDispatcher.createChannel(processID);

        const process = new EngineProcessHost(
            0, // TODO: Fix this shit
            messageChannel,
            wasmModule);
        this.m_ProcessRegistry.set(processID, process);

        return true;
    }

    public async stopProcess(processID: string): Promise<boolean>
    {
        if (!this.m_ProcessRegistry.has(processID))
        {
            this.log(EngineLogLevel.WARN, `Cannot stop nonexistent process with ID '${processID}'`);
            return;
        }
        const process = this.m_ProcessRegistry.get(processID);
        await process.exit();
        this.m_ProcessRegistry.delete(processID);
        this.log(EngineLogLevel.DEBUG, `Stopped process with ID '${processID}'`);
    }

    public async stopAll(): Promise<void>
    {
        for (const processID of this.m_ProcessRegistry.keys())
            await this.stopProcess(processID);
        this.log(EngineLogLevel.INFO, "Stopped all modules");
    }

    public getProcess(processID: string): AEngineHost
    {
        return this.m_ProcessRegistry.get(processID) || null;
    }
}

export default ProcessesEngineSubsystem;