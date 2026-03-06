import EngineWasmInstance from "../wasm/EngineWasmInstance.ts";
import EngineWasmInstancePool from "../wasm/EngineWasmInstancePool.ts";
import EngineMessage from "../messages/EngineMessage.ts";
import EngineWasmModule from "../wasm/EngineWasmModule.ts";

class EngineProcess
{
    private m_MessageCallback: number;
    private m_WasmInstances: EngineWasmInstancePool = null;

    public constructor()
    {

    }

    public async init(wasmModule: EngineWasmModule): Promise<boolean>
    {
        const instance = this.m_WasmInstances.createInstance(0, wasmModule);
        if (!instance) return false;

        // --- Build hosts ---
        // 1. Set message callback
        instance.callExport("setEventCallback", this.m_MessageCallback);

        // 2. Build init payload (placeholder)
        const payload: Int16Array = new Int16Array;
        const payloadLen: number = payload.length;
        instance.callExport("init", payloadLen, payload);

        return true;
    }

    public async start(): Promise<boolean>
    {
        const instance: EngineWasmInstance = this.m_WasmInstances.getInstance(0);
        if (!instance) return false;
        instance.callExport("start");
        return true;
    }

    public async exit(): Promise<boolean>
    {
        const instance: EngineWasmInstance = this.m_WasmInstances.getInstance(0);
        if (!instance) return false;
        instance.callExport("exit");
        return true;
    }

    public async event(message: EngineMessage): Promise<boolean>
    {
        const instance: EngineWasmInstance = this.m_WasmInstances.getInstance(0);
        if (!instance) return false;
        instance.callExport("sendMessage", message.type, message.payloadLen, message.payload);
        return true;
    }

    public async createChildProcess(): Promise<void>
    {

    }
}

export default EngineProcess;