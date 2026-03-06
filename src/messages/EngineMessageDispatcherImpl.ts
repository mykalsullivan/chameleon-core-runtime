import EngineLookupSystem from "../lookup/EngineLookupSystem.ts";
import EngineMessageHandler from "./EngineMessageHandler.ts";
import EngineMessageChannelImpl from "./EngineMessageChannelImpl.ts";
import Queue from "../util/Queue.ts";
import EngineMessage from "./EngineMessage.ts";
import EngineLogLevel from "../logging/EngineLogLevel.ts";

class EngineMessageDispatcherImpl
{
    private m_LookupSystem: EngineLookupSystem = null;
    private m_Channels: Map<string, EngineMessageChannelImpl> = new Map();
    private m_Handlers: Map<string, EngineMessageHandler> = new Map();
    private m_Subscribers: Map<number, number> = new Map();
    private m_Queue: Queue<EngineMessage> = new Queue();

    public constructor(lookupSystem: EngineLookupSystem)
    {
        this.m_LookupSystem = lookupSystem;
    }

    public createChannel(id: string): EngineMessageChannelImpl
    {
        const messageChannel = new EngineMessageChannelImpl(id);
        this.m_Channels.set(id, messageChannel);
        return messageChannel;
    }

    public removeChannel(id: string): void
    {
        if (!this.m_Channels.has(id)) return;
        this.m_Channels.delete(id);
    }

    public enqueue(message: EngineMessage): void
    {
        this.m_Queue.enqueue(message);
    }

    public dequeue(): void
    {
        this.m_Queue.dequeue();
    }

    public clear(): void
    {
        this.m_Queue.clear();
    }

    public flush(): void
    {
        if (this.m_Queue.isEmpty) return;

        // ---- Snapshot queue ----
        const queue = this.m_Queue.copy();

        // // ---- Sort by priority (highest first) ----
        // queue.sort((a, b) => b.priority - a.priority);
        //
        // // ---- Phase 1: Runtime / systems messages ----
        // for (const msg of queue)
        //     if (msg.recipientID === "Runtime") this.deliver(msg);
        //
        // // ---- Phase 2: Process routing ----
        // for (const msg of queue)
        // {
        //     if (msg.recipientID === "Runtime") continue;
        //     this.route(msg);
        // }
    }

    public subscribe(id: number, subscriber: any): void
    {
        this.m_Subscribers.set(id, subscriber);
    }

    public unsubscribe(id: number): void
    {
        this.m_Subscribers.delete(id);
    }

    // private safeDeliver(target: string, id: string, msg: string): void
    // {
    //     try
    //     {
    //         target.receiveMessage?.(msg.senderID, msg.type, msg.payload);
    //     }
    //     catch (err)
    //     {
    //         this.log(EngineLogLevel.ERROR, `Delivery to '${id}' failed: ${err}`);
    //     }
    // }

    // private deliver(msg: string): void
    // {
    //     const target = this.m_Subscribers.get(msg.recipientID);
    //     if (!target) return;
    //
    //     try
    //     {
    //         target.receiveMessage?.(msg.senderID, msg.type, msg.payload);
    //     }
    //     catch (err)
    //     {
    //         this.log(EngineLogLevel.ERROR, `Runtime delivery failed: ${err}`);
    //     }
    // }

    // private route(msg: string): void
    // {
    //     // ---- Broadcast ----
    //     if (msg.recipientID === "ALL")
    //     {
    //         for (const [id, sub] of this.m_Subscribers)
    //         {
    //             if (id === msg.senderID) continue;
    //             if (id === "Runtime") continue;
    //             this.safeDeliver(sub, id, msg);
    //         }
    //         return;
    //     }
    //
    //     // ---- Direct routing ----
    //     const target = this.m_Subscribers.get(msg.recipientID);
    //
    //     if (!target)
    //     {
    //         this.log(EngineLogLevel.WARN, `Recipient '${msg.recipientID}' not found for message '${msg.type}'`);
    //         return;
    //     }
    //
    //     this.safeDeliver(target, msg.recipientID, msg);
    // }
}

export default EngineMessageDispatcherImpl;