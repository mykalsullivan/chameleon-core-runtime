class Queue<T>
{
    private m_Items: T[] = [];

    public enqueue(item: T): void
    {
        this.m_Items.push(item);
    }

    public dequeue(): void
    {

    }

    public get isEmpty(): boolean
    {
        return this.m_Items.length === 0;
    }

    public size(): number
    {
        return this.m_Items.length;
    }

    public peek(): T
    {
        return this.m_Items.at(this.m_Items.length);
    }

    public clear(): void
    {
        this.m_Items.length = 0;
    }

    public copy(): Queue<T>
    {
        const queueCopy = new Queue<T>;
        this.m_Items.forEach((item: T): void =>
        {
            queueCopy.enqueue(item);
        });
        return queueCopy;
    }
}

export default Queue;