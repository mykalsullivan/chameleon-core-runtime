import EngineSubsystemBridge from "./subsystems/EngineSubsystemBridge.ts";
import EngineLookupSystem from "./lookup/EngineLookupSystem.ts";
import EngineMessageDispatcher from "./messages/EngineMessageDispatcher.ts";
import EngineHostState from "./hosts/EngineHostState.ts";
import AEngineHost from "./hosts/AEngineHost.ts";

class ChameleonEngine
{
    private m_Subsystems: EngineSubsystemBridge = null;

    public async start(gamePath: string, canvas: HTMLCanvasElement): Promise<boolean>
    {
        const lookupSystem = new EngineLookupSystem()
        const messageDispatcher = new EngineMessageDispatcher(lookupSystem);
        this.m_Subsystems = new EngineSubsystemBridge(lookupSystem, messageDispatcher, canvas);

        try
        {
            this.m_Subsystems.processes.createRuntimeProcess(
                messageDispatcher,
                this.m_Subsystems,
                gamePath);
        }
        catch (e: any)
        {
            return false;
        }

        const runtimeHost: AEngineHost = this.m_Subsystems.processes.getProcess("Engine");
        if (!runtimeHost || !runtimeHost.isState(EngineHostState.STOPPED)) return;
        await runtimeHost.start();
    }

    public async exit(): Promise<void>
    {
        const runtimeHost = this.m_Subsystems.processes.getProcess("Engine");
        if (!runtimeHost || !runtimeHost.isState(EngineHostState.RUNNING)) return;
        await runtimeHost.exit();
    }
}

export default ChameleonEngine;