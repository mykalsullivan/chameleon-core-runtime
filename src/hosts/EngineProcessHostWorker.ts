import EngineProcess from "./EngineProcess.ts";
let process: EngineProcess = null;

self.onmessage = async (event: any): Promise<void> =>
{
    const {type, payload} = event.data;
    try
    {
        switch (type)
        {
            case "init":
            {
                if (process) return;
                await process.init(payload.wasmModule, payload.wasmImports);
                self.postMessage({type: "ready"});
                break;
            }
            case "start":
            {
                if (!process) return;
                await process.start();
                self.postMessage({type: "started"});
                break;
            }
            case "exit":
            {
                if (!process) return;
                await process.exit();
                self.postMessage({type: "exited"});
                self.close();
                break;
            }
            case "event":
            {
                if (!process) return;
                await process.event(payload);
                break;
            }
        }
    }
    catch (error)
    {
        self.postMessage(
        {
            type: "error",
            payload: error.message
        });
    }
};