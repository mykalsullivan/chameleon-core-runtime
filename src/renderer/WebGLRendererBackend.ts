import ARendererBackend from "./ARendererBackend.ts";
import Queue from "../util/Queue.ts";

class WebGLRendererBackend extends ARendererBackend
{
    public constructor(canvas: HTMLCanvasElement)
    {
        super(canvas);
        this.m_Ctx = canvas.getContext("webgl2");
        // Initialize Shaders, buffers, etc.
    }

    public override cleanup(): void
    {
    }

    public override draw(commandBuffer: Queue<DrawCommand>, imageCache: any): void
    {
        this.m_Ctx.clear(this.m_Ctx.COLOR_BUFFER_BIT | this.m_Ctx.DEPTH_BUFFER_BIT);
        // Blah blah blah
    }
}