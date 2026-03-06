import AEngineSubsystem from "./AEngineSubsystem.ts";
import EngineMessageChannel from "../messages/EngineMessageChannel.ts";
import WindowEngineSubsystem from "./WindowEngineSubsystem.ts";
import EventsEngineSubsystem from "./EventsEngineSubsystem.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

type MousePosition =
{
    x: number;
    y: number;
}

type InputBuffer =
{
    keys: Set<string>;
    mouseButtons: Set<number>;
    mousePosition: MousePosition;
}

class InputEngineSubsystem extends AEngineSubsystem
{
    private m_Buffer: InputBuffer;

    public constructor(messageChannel: EngineMessageChannel,
                       window: WindowEngineSubsystem, events: EventsEngineSubsystem)
    {
        super(messageChannel.numericID, messageChannel);
        const canvas = window.canvas;

        // --- Keyboard events ---
        events.add(document, "keydown", (e: KeyboardEvent): void =>
        {
            if (!window.isFocused) return;

            this.m_Buffer.keys.add(e.code);
            this.log(EngineLogLevel.DEBUG, `Key '${e.code}' pressed`);
        });
        events.add(document, "keyup", (e) =>
        {
            if (!window.isFocused) return;
            this.m_Buffer.keys.delete(e.code);
        });

        // --- Mouse events ---
        events.add(canvas, "mousedown", (e: MouseEvent): void =>
        {
            if (!window.isFocused) return;

            this.m_Buffer.mouseButtons.add(e.button);
            let buttonString = "";
            switch (e.button)
            {
                case 0:
                    buttonString = "MouseLeft";
                    break;
                case 1:
                    buttonString = "MouseMiddle";
                    break;
                case 2:
                    buttonString = "MouseRight";
                    break;
                default:
                    buttonString = `${e.button}`;
            }

            const mouse =
            {
                x: this.m_Buffer.mousePosition.x,
                y: this.m_Buffer.mousePosition.y
            }
            this.log(EngineLogLevel.DEBUG, `Mouse button '${buttonString}' pressed (${mouse.x}, ${mouse.y})`);
        });
        events.add(canvas, "mouseup", (e) =>
        {
            if (!window.isFocused) return;

            this.m_Buffer.mouseButtons.delete(e.button);
        });
        events.add(canvas, "mousemove", (e) =>
        {
            if (!window.isFocused) return;

            const rect = canvas.getBoundingClientRect();
            this.m_Buffer.mousePosition.x = e.clientX - rect.left;
            this.m_Buffer.mousePosition.y = e.clientY - rect.top;
        });
    }

    public poll(): InputBuffer
    {
        return {
            keys: new Set(this.m_Buffer.keys),
            mouseButtons: new Set(this.m_Buffer.mouseButtons),
            mousePosition: {...this.m_Buffer.mousePosition},
        };
    }

    public isKeyPressed(code: string): boolean
    {
        return this.m_Buffer.keys.has(code);
    }

    public isMousePressed(button: number): boolean
    {
        return this.m_Buffer.mouseButtons.has(button);
    }

    public getMousePosition(): MousePosition
    {
        return this.m_Buffer.mousePosition;
    }
}

export default InputEngineSubsystem;