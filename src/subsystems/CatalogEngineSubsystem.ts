import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";
import LookupEngineSubsystem from "./LookupEngineSubsystem.ts";

function uuidv4(): string
{
    const randomValues = crypto.getRandomValues(new Uint8Array(16));

    // Set the version (4) and variant (10x, 01x) bits according to the UUID v4 specification
    randomValues[6] = (randomValues[6] & 0x0f) | 0x40; // Version 4
    randomValues[8] = (randomValues[8] & 0x3f) | 0x80; // Variant 10x

    // Convert the bytes to a UUID string format
    return [...randomValues].map((value, index) => {
        const hex = value.toString(16).padStart(2, '0');
        // Insert hyphens at appropriate positions
        if (index === 4 || index === 6 || index === 8 || index === 10) {
            return `-${hex}`;
        }
        return hex;
    }).join('');
}

class CatalogEngineSubsystem extends AEngineSubsystem
{
    private m_LookupAPI: LookupEngineSubsystem = null;
    private m_Assets: Map<string, any> = new Map();
    private m_ContentDefinitions: Map<string, any> = new Map();
    private m_ContentEntries: Map<string, any> = new Map();

    constructor(messageChannel: EngineMessageChannel,
                lookupAPI: LookupEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_LookupAPI = lookupAPI;
    }

    private qualify(namespace: string, id: string): string
    {
        return id.includes(":") ? id : `${namespace}:${id}`;
    }

    private createRecord(namespace: string, id: string, path: string, guid: string): any
    {
        return {
            namespace,
            id,
            globalID: this.qualify(namespace, id),
            path,
            guid,
            data: null
        };
    }

    private ensureMap(rootMap, key: string): any
    {
        if (!rootMap.has(key)) rootMap.set(key, new Map());
        return rootMap.get(key);
    }

    public getNamespaces(): any[]
    {
        const set = new Set();
        for (const map of this.m_Assets.values())
            for (const record of map.values())
                set.add(record.namespace);
        return [...set];
    }

    public registerAsset(namespace: string, type: string, entry, absolutePath: string)
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Register asset '${namespace}:${entry}'`);
        if (!entry.id || !entry.path)
            throw new Error("Invalid asset entry");

        const record = this.createRecord(
            namespace,
            entry.id,
            absolutePath,
            entry.guid ?? uuidv4()
        );

        const map = this.ensureMap(this.m_Assets, type);
        map.set(record.globalID, record);

        const table = this.m_LookupAPI.getTable(namespace) || this.m_LookupAPI.createTable(namespace);
        table.register(record.guid, { type, globalID: record.globalID });

        this.log(EngineLogLevel.INFO, `(Success) Register asset '${namespace}:${entry}'`);
        return record;
    }

    public getAssetsByNamespace(namespace: string): any[]
    {
        const results = [];
        for (const [type, map] of this.m_Assets.entries())
            for (const record of map.values())
                if (record.namespace === namespace)
                    results.push({ type, record });
        return results;
    }

    public registerContentDefinition(namespace: string, registry, entry, absolutePath: string): any
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Register content definition for '${namespace}' (${absolutePath})`);
        const record = this.createRecord(namespace, entry.id, absolutePath, entry.guid ?? uuidv4());
        const map = this.ensureMap(this.m_ContentDefinitions, registry);
        map.set(record.globalID, record);
        return record;
    }

    public registerContentEntry(namespace: string, registry, entry, absolutePath: string): any
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Register content entry for '${namespace}' (${absolutePath})`);
        const record = this.createRecord(namespace, entry.id, absolutePath, entry.guid ?? uuidv4());
        const map = this.ensureMap(this.m_ContentEntries, registry);
        map.set(record.globalID, record);
        return record;
    }

    public getAssetRecord(type: string, globalID: string): any
    {
        return this.m_Assets.get(type)?.get(globalID);
    }

    public getContentDefinitionRecord(registry, globalID: string): any
    {
        return this.m_ContentDefinitions.get(registry)?.get(globalID);
    }

    public getContentEntryRecord(registry, globalID: string): any
    {
        return this.m_ContentEntries.get(registry)?.get(globalID);
    }

    public unloadPackage(namespace: string): void
    {
        this.log(EngineLogLevel.DEBUG, `(Attempting) Unload catalog for '${namespace}'`);
        for (const map of this.m_Assets.values())
            for (const [k, v] of map)
                if (v.namespace === namespace) map.delete(k);

        for (const map of this.m_ContentDefinitions.values())
            for (const [k, v] of map)
                if (v.namespace === namespace) map.delete(k);

        for (const map of this.m_ContentEntries.values())
            for (const [k, v] of map)
                if (v.namespace === namespace) map.delete(k);
        this.log(EngineLogLevel.DEBUG, `(Success) Unload catalog for '${namespace}'`);
    }

    public clear(): void
    {
        this.m_Assets.clear();
        this.m_ContentDefinitions.clear();
        this.m_ContentEntries.clear();
        this.log(EngineLogLevel.DEBUG, "Catalog cleared");
    }
}

export default CatalogEngineSubsystem;