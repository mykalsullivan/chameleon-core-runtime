import AEngineHost from "./AEngineHost.ts";
import EngineHostState from "./EngineHostState.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EngineSubsystemBridge from "../subsystems/EngineSubsystemBridge.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

const enginePackageRoot = "/Assets/packages/engine/core.cpkg";

class EngineRuntimeProcessHost extends AEngineHost
{
    private readonly m_GamePath: string = null;
    private readonly m_Subsystems: EngineSubsystemBridge = null;

    public constructor(messageChannel: EngineMessageChannel,
                       subsystems: EngineSubsystemBridge,
                       gamePath: string)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_Subsystems = subsystems;
        this.m_GamePath = gamePath;
        this.log(EngineLogLevel.INFO, "Chameleon Engine v0.0.0 (placeholder)");
    }

    private gameLoop(): void
    {
        this.setState(EngineHostState.RUNNING);

        const loop = (): void =>
        {
            if (this.isState(EngineHostState.RUNNING)) return;
            try
            {
                // 1. Poll Input
                this.m_Subsystems.input.poll();

                // // 2. Flush hosts messages
                // this.m_Subsystems.messages.flush();

                // 3. Render
                this.m_Subsystems.renderer.drawFrame();
            }
            catch (e)
            {
                this.log(EngineLogLevel.ERROR, `Runtime error: ${e}`);
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    public override async start(): Promise<void>
    {
        if (!this.isState(EngineHostState.STOPPED))
        {
            this.log(EngineLogLevel.WARN, "Cannot start engine that is not stopped");
            return;
        }

        // --- Update state ---
        this.setState(EngineHostState.STARTING);

        // --- Attempt startup ---
        try
        {
            // 1. Try to load packages
            await this.m_Subsystems.packages.loadAllPackages(enginePackageRoot, this.m_GamePath);

            // 2. Subscribe to messaging API
            //this.m_Subsystems.messages.subscribe("Runtime", this);

            // 3. Start main game hosts
            this.m_Subsystems.processes.createProcess("Main", "game", "main");
        }
        catch (err)
        {
            // Just exit for now
            this.log(EngineLogLevel.ERROR, `Engine failed to start: ${err.message}`);
            await this.exit();
        }

        // --- Start game loop ---
        this.gameLoop();
    }

    private async safeShutdown(): Promise<void>
    {
        async function attempt(label: string, func: Function): Promise<void>
        {
            try
            {
                await func();
            }
            catch (err)
            {
                this.log.error(`${label} failed: ${err}`);
            }
        }

        // 1. Signal shutdown via messaging
        // this.m_Subsystems.messages.broadcast?.({ type: "engine.shutdown" });

        // // 2. Flush final messages
        // await attempt("Flush messages", () =>
        //     this.m_Subsystems.messages.flush());

        // 3. Stop all modules
        await attempt("Stop modules", (): Promise<void> =>
            this.m_Subsystems.processes.stopAll?.());

        // 4. Unload cached stuff (WASM, Assets)
        await Promise.allSettled(
        [
            attempt("Unload WASM modules", (): Promise<void> =>
                this.m_Subsystems.wasm.unloadAll?.()),
            attempt("Unload Assets", () =>
                this.m_Subsystems.assets.unloadAll?.())
        ]);

        // 6. Remove listeners
        await attempt("Remove listeners", () =>
            this.m_Subsystems.events.removeAll?.());

        // // 7. Clear remaining messages
        // await attempt("Clear messages", () =>
        //     this.m_Subsystems.messages.clear?.());
    }

    public override async exit(): Promise<void>
    {
        if (!this.isState(EngineHostState.RUNNING) && !this.isState(EngineHostState.STARTING)) return;

        // --- Update api state ---
        this.log(EngineLogLevel.INFO, "Exiting Chameleon...");
        this.setState(EngineHostState.STOPPING);

        // --- Safely shut down everything ---
        await this.safeShutdown();

        // --- Update again ---
        this.setState(EngineHostState.STOPPED);
        this.log(EngineLogLevel.INFO, "Chameleon exited.");
    }
}

export default EngineRuntimeProcessHost;