import AEngineHost from "./AEngineHost.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";
import EngineMessage from "../messages/EngineMessage.ts";

class EngineProcessHost extends AEngineHost
{
    private readonly m_ParentID: number = null;
    private readonly m_WasmModule: WebAssembly.Module = null;

    private m_Worker = new Worker(new URL("./EngineProcessHostWorker.ts"));
    private m_StopTimeout: any = null;

    public constructor(parentID: number,
                       messageChannel: EngineMessageChannel,
                       wasmModule: WebAssembly.Module)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_ParentID = parentID;
        this.m_WasmModule = wasmModule;

        // --- Handle responding to worker events ---
        this.m_Worker.onmessage = (event: MessageEvent<any>): void =>
        {
            this.onReceiveMessage(event.data);
        }
        this.m_Worker.onerror = (e: ErrorEvent): void =>
        {
            this.log(EngineLogLevel.ERROR, `Failed to start worker: ${e}`);
        }
    }

    protected get parentID(): number { return this.m_ParentID; }

    private onReceiveMessage(message: EngineMessage): void
    {
        this.sendMessage(message);
    }

    public async start(): Promise<void>
    {
        this.m_Worker.postMessage(
        {
            type: "start",
            wasmModule: this.m_WasmModule
        });
    }

    public override async exit(): Promise<void>
    {
        this.receiveMessage("exit", "");
        this.m_StopTimeout = setTimeout((): void =>
        {
            this.m_Worker.terminate();
        }, 10000);
    }

    public receiveMessage(type: string, payload: string)
    {
        this.m_Worker.postMessage(
        {
            type: "event",
            messageType: type,
            messagePayload: payload
        });
    }
}

export default EngineProcessHost;