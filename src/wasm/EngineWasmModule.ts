type EngineWasmModule =
{
    id: string,
    module: WebAssembly.Module,
    imports: WebAssembly.Imports
}

export default EngineWasmModule;