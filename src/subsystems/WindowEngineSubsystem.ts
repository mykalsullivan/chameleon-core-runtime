import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import EventsEngineSubsystem from "./EventsEngineSubsystem.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";


class WindowEngineSubsystem extends AEngineSubsystem
{
    private readonly m_Canvas: HTMLCanvasElement = null;

    public constructor(messageChannel: EngineMessageChannel,
                       canvas: HTMLCanvasElement,
                       eventsAPI: EventsEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        this.m_Canvas = canvas;
        this.setupWindowEvents(eventsAPI);
    }

    private onResize(): void
    {
        this.log(EngineLogLevel.DEBUG, `Resized to ${this.m_Canvas.clientWidth}x${this.m_Canvas.clientHeight}`);
        // Probably send commands to the client hosts
    }

    private onFocus(): void
    {
        this.log(EngineLogLevel.DEBUG, "Went in-focus");
        // Probably tell modules to resume or at least let them know
    }

    private onBlur(): void
    {
        this.log(EngineLogLevel.DEBUG, "Went out-of-focus");
        // Probably tell modules to pause or at least let them know
    }

    private onVisibilityChange(): void
    {
        this.log(EngineLogLevel.DEBUG, "Visibility changed");
        // EngineMessage modules
    }

    private setupWindowEvents(eventsAPI: EventsEngineSubsystem): void
    {
        eventsAPI.add(window, "resize", this.onResize.bind(this));
        eventsAPI.add(window, "focus", this.onFocus.bind(this));
        eventsAPI.add(window, "blur", this.onBlur.bind(this));
        eventsAPI.add(window, "visibilitychange", this.onVisibilityChange.bind(this));

        this.log(EngineLogLevel.DEBUG, "Added window events");
    }

    public get canvas(): HTMLCanvasElement { return this.m_Canvas; }
    public get isFocused(): boolean { return document.hasFocus(); }
    public get isVisible(): boolean { return document.visibilityState === "visible"; }

    // Currently does not work, but this could allow games to dynamically change the favicon
    public setFavicon(iconAssetID: string): void
    {
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = "/favicon.png";
        document.head.appendChild(link);
    }
}

export default WindowEngineSubsystem;