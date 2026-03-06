import EngineLookupSystem from "../lookup/EngineLookupSystem.ts";
import EngineMessageDispatcher from "../messages/EngineMessageDispatcher.ts";
import AssetsEngineSubsystem from "./AssetsEngineSubsystem.ts";
import AudioEngineSubsystem from "./AudioEngineSubsystem.ts";
import CatalogEngineSubsystem from "./CatalogEngineSubsystem.ts";
import ClockEngineSubsystem from "./ClockEngineSubsystem.ts";
import DatabaseEngineSubsystem from "./DatabaseEngineSubsystem.ts";
import EventsEngineSubsystem from "./EventsEngineSubsystem.ts";
import FilesystemEngineSubsystem from "./FilesystemEngineSubsystem.ts";
import InputEngineSubsystem from "./InputEngineSubsystem.ts";
import LookupEngineSubsystem from "./LookupEngineSubsystem.ts";
import NetworkEngineSubsystem from "./NetworkEngineSubsystem.ts";
import PackagesEngineSubsystem from "./PackagesEngineSubsystem";
import ProcessesEngineSubsystem from "./ProcessesEngineSubsystem.ts";
import RendererEngineSubsystem from "./RendererEngineSubsystem.ts";
import WindowEngineSubsystem from "./WindowEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";

class EngineSubsystemBridge
{
    private readonly m_AssetsAPI: AssetsEngineSubsystem = null;
    private readonly m_AudioAPI: AudioEngineSubsystem = null;
    private readonly m_CatalogAPI: CatalogEngineSubsystem = null;
    private readonly m_ClockAPI: ClockEngineSubsystem = null;
    private readonly m_DatabaseAPI: DatabaseEngineSubsystem = null;
    private readonly m_EnvironmentAPI: any = null;
    private readonly m_EventsAPI: EventsEngineSubsystem = null;
    private readonly m_FilesystemAPI: FilesystemEngineSubsystem = null;
    private readonly m_InputAPI: InputEngineSubsystem = null;
    private readonly m_LookupAPI: LookupEngineSubsystem = null;
    private readonly m_NetworkAPI: NetworkEngineSubsystem = null;
    private readonly m_PackagesAPI: PackagesEngineSubsystem = null;
    private readonly m_ProcessesAPI: ProcessesEngineSubsystem = null;
    private readonly m_RendererAPI: RendererEngineSubsystem = null;
    private readonly m_WindowAPI: WindowEngineSubsystem = null;

    // Will eventually take arguments for which backends to load or a platform config or something
    public constructor(lookupSystem: EngineLookupSystem,
                       messageDispatcher: EngineMessageDispatcher,
                       canvas: HTMLCanvasElement)
    {
        function setup(id: string): EngineMessageChannel
        {
            return messageDispatcher.createChannel(id);
        }

        // --- Setup APIs ---
        this.m_EventsAPI = new EventsEngineSubsystem(setup("Events"));
        this.m_WindowAPI = new WindowEngineSubsystem(setup("Window"), canvas, this.m_EventsAPI);
        this.m_FilesystemAPI = new FilesystemEngineSubsystem(setup("Filesystem"));
        this.m_InputAPI = new InputEngineSubsystem(setup("Input"), this.m_WindowAPI, this.m_EventsAPI);
        this.m_LookupAPI = new LookupEngineSubsystem(setup("Lookup"));
        this.m_CatalogAPI = new CatalogEngineSubsystem(setup("Catalog"), this.m_LookupAPI);
        this.m_AssetsAPI = new AssetsEngineSubsystem(setup("Assets"), this.m_CatalogAPI);
        this.m_ProcessesAPI = new ProcessesEngineSubsystem(setup("Processes"), messageDispatcher, this.m_AssetsAPI);
        this.m_PackagesAPI = new PackagesEngineSubsystem(setup("Packages"), this.m_CatalogAPI);
        this.m_RendererAPI = new RendererEngineSubsystem(setup("Renderer"), this.m_WindowAPI, this.m_AssetsAPI);
        this.m_AudioAPI = new AudioEngineSubsystem(setup("Audio"));
        this.m_ClockAPI = new ClockEngineSubsystem(setup("Clock"));
        this.m_NetworkAPI = new NetworkEngineSubsystem(setup("Network"));
        this.m_DatabaseAPI = new DatabaseEngineSubsystem(setup("Database"));

        // --- Freeze APIs ---
        Object.freeze(this.m_EventsAPI);
        Object.freeze(this.m_WindowAPI);
        Object.freeze(this.m_FilesystemAPI);
        Object.freeze(this.m_InputAPI);
        Object.freeze(this.m_LookupAPI);
        Object.freeze(this.m_CatalogAPI);
        Object.freeze(this.m_AssetsAPI);
        Object.freeze(this.m_ProcessesAPI);
        Object.freeze(this.m_PackagesAPI);
        Object.freeze(this.m_RendererAPI);
        Object.freeze(this.m_AudioAPI);
        Object.freeze(this.m_ClockAPI);
        Object.freeze(this.m_NetworkAPI);
        Object.freeze(this.m_DatabaseAPI);
    }

    public get assets(): AssetsEngineSubsystem { return this.m_AssetsAPI; }
    public get audio(): AudioEngineSubsystem { return this.m_AudioAPI; }
    public get clock(): ClockEngineSubsystem { return this.m_ClockAPI; }
    public get db(): DatabaseEngineSubsystem { return this.m_DatabaseAPI; }
    public get environment(): any { return this.m_EnvironmentAPI; }
    public get events(): EventsEngineSubsystem { return this.m_EventsAPI; }
    public get filesystem(): FilesystemEngineSubsystem { return this.m_FilesystemAPI; }
    public get input(): InputEngineSubsystem { return this.m_InputAPI; }
    public get lookup(): LookupEngineSubsystem { return this.m_LookupAPI; }
    public get network(): NetworkEngineSubsystem { return this.m_NetworkAPI; }
    public get packages(): PackagesEngineSubsystem { return this.m_PackagesAPI; }
    public get processes(): ProcessesEngineSubsystem { return this.m_ProcessesAPI; }
    public get renderer(): RendererEngineSubsystem { return this.m_RendererAPI; }
    public get window(): WindowEngineSubsystem { return this.m_WindowAPI; }
}

export default EngineSubsystemBridge;