import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import CatalogAPI from "./CatalogEngineSubsystem.ts";
import AssetCache from "../assets/AssetCache.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

class AssetsEngineSubsystem extends AEngineSubsystem
{
    private m_CatalogAPI: CatalogAPI = null;
    private m_Caches = new Map<string, AssetCache>();

    public constructor(messageChannel: EngineMessageChannel,
                       catalogAPI: CatalogAPI)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_CatalogAPI = catalogAPI;
    }

    private getCache(pkg: string)
    {
        if (!this.m_Caches.has(pkg)) this.m_Caches.set(pkg, new AssetCache());
        return this.m_Caches.get(pkg);
    }

    private qualify(pkg: string, id: string): string
    {
        return id.includes(":") ? id : `${pkg}:${id}`;
    }

    private splitGlobalID(globalID: string)
    {
        if (!globalID.includes(":"))
            throw new Error(`Global ID '${globalID}' missing namespace`);
        const [pkg, id] = globalID.split(":");
        return { pkg, id };
    }

    private async loadAsset(pkg: string, type: string, id: string, loader: Function): Promise<any>
    {
        const cache: AssetCache = this.getCache(pkg);
        const globalID: string = this.qualify(pkg, id);

        if (cache.has(type, globalID)) return cache.get(type, globalID);
        if (cache.pending[type].has(globalID)) return cache.pending[type].get(globalID);

        const record: any = this.m_CatalogAPI.getAssetRecord(type, globalID);
        if (!record) throw new Error(`Missing asset '${globalID}'`);

        const promise: any = loader(record.path)
            .then((asset: any) =>
            {
                cache.set(type, globalID, asset);
                return asset;
            })
            .catch((err: string): never =>
            {
                this.log(EngineLogLevel.ERROR, err);
                throw err;
            });

        cache.pending[type].set(globalID, promise);
        try
        {
            return await promise;
        }
        finally
        {
            cache.pending[type].delete(globalID);
        }
    }

    public async unloadAsset(pkg: string, type: string, id: string, unloader: Function): Promise<boolean>
    {
        const cache: AssetCache = this.m_Caches.get(pkg);
        if (!cache) return;
        const globalID: string = this.qualify(pkg, id);
        cache.delete(type, globalID);


        return true;
    }

    public async getImage(globalID: string): Promise<typeof Image>
    {
        const { pkg, id } = this.splitGlobalID(globalID);
        return this.loadAsset(pkg, "images", id, async (path: string): Promise<HTMLImageElement> =>
            new Promise((resolve, reject) =>
            {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = path;
            }));
    }

    public async getFont(globalID: string): Promise<typeof FontFace>
    {
        const { pkg, id } = this.splitGlobalID(globalID);
        return this.loadAsset(pkg, "fonts", id, async (path: string): Promise<FontFace> =>
        {
            const font = new FontFace(id, `url(${path})`);
            await font.load();
            document.fonts.add(font);
            return font;
        });
    }

    public async getSound(globalID: string): Promise<typeof Audio>
    {
        const { pkg, id } = this.splitGlobalID(globalID);
        return this.loadAsset(pkg, "sounds", id, async (path: string): Promise<HTMLAudioElement> =>
            new Promise((resolve, reject): void =>
            {
                const snd = new Audio(path);
                snd.oncanplaythrough = (): void => resolve(snd);
                snd.onerror = reject;
            }));
    }

    public async getWasmModule(globalID: string): Promise<typeof WebAssembly.Module>
    {
        const { pkg, id } = this.splitGlobalID(globalID);
        return this.loadAsset(pkg, "wasm", id, async (path: string): Promise<WebAssembly.Module> =>
        {
            const resp: Response = await fetch(path);
            const bytes: ArrayBuffer = await resp.arrayBuffer();
            return WebAssembly.compile(bytes);
        });
    }

    public unloadPackage(pkg: string): void
    {
        this.m_Caches.delete(pkg);
    }

    public unloadAll(): void
    {
        this.m_Caches.clear();
    }

    // DEBUG
    public async testLoadAllAssets(namespace: string): Promise<void>
    {
        this.log(EngineLogLevel.DEBUG, `[DEV] Testing asset load for '${namespace}'`);
        const records: any[] = this.m_CatalogAPI.getAssetsByNamespace(namespace);
        const promises: Promise<any>[] = [];

        for (const { type, record } of records)
        {
            const globalID = record.globalID;

            let loaderPromise: Promise<Function>;

            switch (type)
            {
                case "images": loaderPromise = this.getImage(globalID); break;
                case "fonts": loaderPromise = this.getFont(globalID); break;
                case "sounds": loaderPromise = this.getSound(globalID); break;
                case "wasm": loaderPromise = this.getWasmModule(globalID); break;
                default: continue;
            }

            promises.push(loaderPromise.catch(err =>
                this.log(EngineLogLevel.DEBUG, `[DEV] Failed ${globalID}: ${err}`)));
        }
        await Promise.all(promises);
        this.log(EngineLogLevel.DEBUG, `[DEV] Completed asset test '${namespace}'`);
    }
}

export default AssetsEngineSubsystem;