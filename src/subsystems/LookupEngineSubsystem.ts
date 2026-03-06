import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import xxhash from "xxhashjs";

class EngineLookupSubsystem extends AEngineSubsystem
{
    private m_Map32 = new Map();
    private m_Map64 = new Map();
    private m_Reverse = new Map();

    public constructor(messageChannel: EngineMessageChannel)
    {
        super(messageChannel.numericID, messageChannel);
    }

    public static hash32(guid: string): number
    {
        return xxhash.h32(guid, 0xABCD).toNumber();
    }

    public static hash64(guid: string): number
    {
        return xxhash.h64(guid, 0xCAFEBABE).toNumber();
    }

    public register(guid: string, runtimeRef)
    {
        const h32 = EngineLookupSubsystem.hash32(guid);
        const h64 = EngineLookupSubsystem.hash64(guid);

        this.m_Map32.set(h32, runtimeRef);
        this.m_Map64.set(h64, runtimeRef);

        // Store GUID inside runtimeRef to make reverse lookup safe
        if (typeof runtimeRef === "object" && runtimeRef !== null)
            runtimeRef.__guid = guid;
        this.m_Reverse.set(runtimeRef, guid);

        return {h32, h64};
    }

    public lookup32(hash: string)
    {
        return this.m_Map32.get(hash);
    }

    public lookup64(hash: string)
    {
        return this.m_Map64.get(hash);
    }

    public reverse(ref)
    {
        return this.m_Reverse.get(ref);
    }

    public unregister(guid: string)
    {
        const h32 = EngineLookupSubsystem.hash32(guid);
        const h64 = EngineLookupSubsystem.hash64(guid);

        const ref = this.m_Map32.get(h32);
        if (ref) this.m_Reverse.delete(ref);

        this.m_Map32.delete(h32);
        this.m_Map64.delete(h64);
    }

    public clear()
    {
        this.m_Map32.clear();
        this.m_Map64.clear();
        this.m_Reverse.clear();
    }
}

export default EngineLookupSubsystem;