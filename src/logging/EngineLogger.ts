const enum TextColor
{
    RED= "red",
    YELLOW = "yellow",
    GREEN = "green",
    BLUE = "blue",
    MAGENTA = "magenta" ,
    CYAN = "cyan",
    WHITE = "white" 
}

const enum TextStyle
{
    BOLD = "font-weight: bold",
    DIM = "opacity: 0.6",
    ITALIC = "font-style: italic",
    UNDERLINE = "text-decoration: underline"
}

type FormattedText = string | [string, string];

class EngineLogger
{
    private formatText(text: string, color: TextColor, styles: TextStyle[] = []): FormattedText
    {
        const cssParts = [];
        cssParts.push(`color: ${color}`);
        styles.forEach(style => { cssParts.push(style); });
        return [`%c${text}`, cssParts.join(";")];
    }

    public debug(id: string, message: string): void
    {
        const [fmt, css] = this.formatText("DEBUG", TextColor.CYAN, [TextStyle.DIM]) as [string, string];
        console.debug(`%c[${id}] ${fmt}: %c${message}`, "color: white;", css, "color: white;");
    }

    public log(id: string, message: string): void
    {
        const [fmt, css] = this.formatText("LOG", TextColor.WHITE, [TextStyle.DIM]) as [string, string];
        console.debug(`%c[${id}] ${fmt}: %c${message}`, "color: white;", css, "color: white;");
    }

    public info(id: string, message: string): void
    {
        const [fmt, css] = this.formatText("INFO", TextColor.WHITE, [TextStyle.BOLD]) as [string, string];
        console.info(`%c[${id}] ${fmt}: %c${message}`, "color: white;", css, "color: white;");
    }

    public warn(id: string, message: string): void
    {
        const [fmt, css] = this.formatText("WARN", TextColor.YELLOW, [TextStyle.BOLD]) as [string, string];
        console.warn(`%c[${id}] ${fmt}: %c${message}`, "color: white;", css, "color: white;");
    }

    public error(id: string, message: string): void
    {
        const [fmt, css] = this.formatText("ERROR", TextColor.RED, [TextStyle.BOLD]) as [string, string];
        console.error(`%c[${id}] ${fmt}: %c${message}`, "color: white;", css, "color: white;");
    }
}

export default EngineLogger;