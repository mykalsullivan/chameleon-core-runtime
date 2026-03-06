import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import CatalogEngineSubsystem from "./CatalogEngineSubsystem.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

class PackagesEngineSubsystem extends AEngineSubsystem
{
    private m_CatalogAPI: CatalogEngineSubsystem = null;

    constructor(messageChannel: EngineMessageChannel,
                catalogAPI: CatalogEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_CatalogAPI = catalogAPI;
    }

    private async fetchJSON(path: string, description: string): Promise<JSON>
    {
        const resp = await fetch(path);
        if (!resp.ok)
            throw new Error(`Failed to fetch ${description} (${resp.status}) from ${path}`);
        return resp.json();
    }

    private async indexAssets(packageID: string, packageRoot: string): Promise<void>
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Index assets for '${packageID}' @ '${packageRoot}'`);
        const index = await this.fetchJSON(`${packageRoot}/assets/index.json`, "asset index");
        const base = new URL("Assets/", packageRoot).href;

        for (const [type, entries] of Object.entries(index))
            for (const entry of entries)
            {
                const path = new URL(entry.path, base).href;
                this.m_CatalogAPI.registerAsset(packageID, type, entry, path);
            }
        this.log(EngineLogLevel.DEBUG, `(Success) Index assets for '${packageID}' @ '${packageRoot}'`);
    }

    private async indexContent(packageID: string, packageRoot: string): Promise<void>
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Index content for '${packageID}' @ '${packageRoot}'`);
        const contentIndex = await this.fetchJSON(`${packageRoot}/content/index.json`, "content index");

        for (const [registry, info] of Object.entries(contentIndex))
        {
            for (const def of info.definitions ?? [])
            {
                const path = new URL(`content/definitions/${def.path}`, packageRoot).href;
                this.m_CatalogAPI.registerContentDefinition(packageID, registry, def, path);
            }
            for (const entry of info.entries ?? [])
            {
                const path = new URL(`content/entries/${entry.path}`, packageRoot).href;
                this.m_CatalogAPI.registerContentEntry(packageID, registry, entry, path);
            }
        }
        this.log(EngineLogLevel.DEBUG, `(Success) Index content for '${packageID}' @ '${packageRoot}'`);
    }

    private async loadPackage(packageID: string, packageRoot: string): Promise<void>
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Load package for '${packageID}' @ '${packageRoot}'`);
        await this.indexAssets(packageID, packageRoot);
        await this.indexContent(packageID, packageRoot);
        this.log(EngineLogLevel.DEBUG, `(Success) Load package for '${packageID}' @ '${packageRoot}'`);
    }

    public async loadAllPackages(coreRoot: string, gameRoot: string): Promise<void>
    {
        await Promise.all(
        [
            this.loadPackage("engine", coreRoot),
            this.loadPackage("game", gameRoot)
        ]);
        this.log(EngineLogLevel.DEBUG, `All packages loaded'`);
    }
}

export default PackagesEngineSubsystem;