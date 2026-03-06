class AssetCache
{
    fonts = new Map();
    images = new Map();
    meshes = new Map();
    shaders = new Map();
    sounds = new Map();
    wasm = new Map();

    pending =
        {
            fonts: new Map(),
            images: new Map(),
            meshes: new Map(),
            shaders: new Map(),
            sounds: new Map(),
            wasm: new Map()
        };

    public get(type, id)
    {
        return this[type]?.get(id);
    }

    public set(type, id, asset): void
    {
        this[type].set(id, asset);
    }

    public has(type, id): boolean
    {
        return this[type].has(id);
    }

    public delete(type, id): void
    {
        if (!this[type].has(id)) return;

        const asset = this[type].get(id);

        if (asset instanceof Audio)
        {
            asset.pause();
            asset.src = "";
        }
        else if (asset instanceof Image)
            asset.src = "";

        this[type].delete(id);
        this.pending[type].delete(id);
    }
}

export default AssetCache;