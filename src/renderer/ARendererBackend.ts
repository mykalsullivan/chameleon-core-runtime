import Queue from "../../util/Queue.ts";

abstract class ARendererBackend
{
    protected readonly m_Canvas: HTMLCanvasElement = null;
    protected m_Ctx: RenderingContext = null;
    protected m_FrameID: number = 0;

    protected constructor(canvas: HTMLCanvasElement)
    {
        this.m_Canvas = canvas;
    }

    protected abstract resize(width: number, height: number): void;
    protected abstract cleanup(): void;
    protected abstract executeDrawCommand(drawCommand: DrawCommand, imageCache: any): void;
    protected abstract clear(): void;

    public draw(buffer: Queue<DrawCommand>): void {}
}

export default ARendererBackend;