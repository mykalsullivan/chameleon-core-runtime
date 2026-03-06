import EngineWasmModule from "./EngineWasmModule.ts";
class EngineWasmInstance
{
    private readonly m_Module: EngineWasmModule = null;
    private m_Instance: WebAssembly.Instance | null = null;
    private m_Exports: WebAssembly.Exports | null = null;
    private m_Memory: WebAssembly.Memory | null = null;

    public constructor(wasmModule: EngineWasmModule)
    {
        this.m_Module = wasmModule;
    }

    async instantiate(wasmModule: EngineWasmModule): Promise<boolean>
    {
        this.m_Instance = await WebAssembly.instantiate(this.m_Module);
        this.m_Exports = this.m_Instance.exports;

        // Attempt to get memory
        const exportedMemory = this.m_Exports["memory"];
        if (exportedMemory instanceof WebAssembly.Memory)
            this.m_Memory = exportedMemory;
        else
        {
            // If not exported, try imports (common case)
            const env = this.m_Module.imports["env"] as any;
            if (env?.memory instanceof WebAssembly.Memory)
                this.m_Memory = env.memory;
        }
        return this.m_Memory !== null;
    }

    public getMemoryView(): Uint8Array | null
    {
        return new Uint8Array(this.m_Memory.buffer);
    }

    public callExport(id: string, ...args: any[])
    {
        const func: WebAssembly.ExportValue = this.m_Exports[id];
        if (typeof func !== 'function')
            throw new Error(`Export '${id}' missing or it is not a function`);

        return func(...args);
    }
}

export default EngineWasmInstance;