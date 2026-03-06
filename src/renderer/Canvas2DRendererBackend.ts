import ARendererBackend from "./ARendererBackend.ts";
import Queue from "../util/Queue.ts";

class Canvas2DRendererBackend extends ARendererBackend
{
    public constructor(canvas: HTMLCanvasElement)
    {
        super(canvas);
        this.m_Ctx = canvas.getContext("2d",
        {
            alpha: false,
            desynchronized: true,
            willReadFrequently: false
        });

        // Enable auto-resizing
        window.addEventListener("resize", () =>
        {
            this.resize(window.innerWidth, window.innerHeight);
        });
        this.resize(window.innerWidth, window.innerHeight);
    }

    public override resize(physicalWidth: number, physicalHeight: number): void
    {
        this.m_Canvas.width = physicalWidth;
        this.m_Canvas.height = physicalHeight;
        this.m_Canvas.style.width = physicalWidth / window.devicePixelRatio + "px";
        this.m_Canvas.style.height = physicalHeight / window.devicePixelRatio + "px";

        this.m_Ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.m_Ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    protected override cleanup(): void
    {

    }

    public override clear(): void
    {
        this.m_Ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.m_Ctx.fillStyle = "#000";
        this.m_Ctx.fillRect(0, 0, this.m_Canvas.width, this.m_Canvas.height);
    }

    public override executeDrawCommand(command: DrawCommand, imageCache: any)
    {
        if (!renderObject) return;

        this.m_Ctx.save();
        this.m_Ctx.globalAlpha = renderObject.alpha ?? 1;
        this.m_Ctx.translate(renderObject.x, renderObject.y);
        this.m_Ctx.rotate(renderObject.rotation ?? 0);
        this.m_Ctx.fillStyle = renderObject.color || "#fff";

        // Draw text
        if (renderObject.isText)
        {
            this.m_Ctx.font = `${renderObject.height || 16}px sans-serif`;
            this.m_Ctx.textAlign = "center";
            this.m_Ctx.textBaseline = "middle";
            this.m_Ctx.fillText
            (
                renderObject.value || "",
                0,
                0,
                renderObject.width || undefined
            );
            this.m_Ctx.restore();
            return;
        }

        // Draw Images if available
        const image = imageCache?.getIfLoaded(renderObject.value);
        if (image instanceof Image && image.complete)
        {
            this.m_Ctx.drawImage
            (
                image,
                -renderObject.width / 2,
                -renderObject.height / 2,
                renderObject.width,
                renderObject.height
            );
        }
        else
        {
            this.m_Ctx.fillRect
            (
                -renderObject.width / 2,
                -renderObject.height / 2,
                renderObject.width,
                renderObject.height
            );
        }

        this.m_Ctx.restore();
    }

    public override draw(commandBuffer: Queue<DrawCommand>, imageCache: any): void
    {
        this.m_Ctx.save();
        for (const command of commandBuffer)
            this.executeDrawCommand(command, imageCache);
        this.m_Ctx.restore();
    }
}