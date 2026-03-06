import EngineWasmInstance from "./EngineWasmInstance.ts";
import EngineWasmModule from "./EngineWasmModule.ts";

class EngineWasmInstancePool
{
    private m_Instances: Map<number, EngineWasmInstance> = new Map();

    public createInstance(id: number, module: EngineWasmModule): EngineWasmInstance
    {
        if (!this.m_Instances.has(id)) return null;
        const instance = new EngineWasmInstance(module);
        this.m_Instances.set(id, instance);
        return instance;
    }

    public removeInstance(id: number): boolean
    {
        if (!this.m_Instances.has(id)) return false;
        this.m_Instances.delete(id);
        return true;
    }

    public getInstance(id: number): EngineWasmInstance | null
    {
        return this.m_Instances.get(id);
    }
}

export default EngineWasmInstancePool;