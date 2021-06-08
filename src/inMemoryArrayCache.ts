import CustomCommand, { CustomCommand as CustomCmd } from "./models/CustomCommand"

export class InMemoryArrayCache {
    
    array: Array<CacheEntry<CustomCmd>>
    size: number

    constructor(size: number) {
        this.size = size
        this.array = new Array<CacheEntry<CustomCmd>>(size)
    }

    /**
     * get
     */
    public async get(guildId: string, name: string): Promise<CustomCmd> {
        const cached = this.array.find((v) => v.getData().guildId == guildId && v.getData().name == name)
        if (cached != undefined && Date.now() - cached?.getCachedAt() < 600000) return cached.getData()
        const data: any = await CustomCommand.findOne({
            guildId: guildId,
            name: name
        })

        if (data == undefined) return undefined;

        const index = this.array.indexOf(cached)
        const entry = new CacheEntry<CustomCmd>(data)
        if (index == 0) {
            this.array[0] = entry
        } else {
            const tmp = this.array[index - 1]
            this.array[index - 1] = entry
            this.array[index] = tmp
        }
        return data;
    }
}

export class CacheEntry<T> {

    data: T
    cachedAt: number

    constructor(entry: T) {
        this.data = entry
        this.cachedAt = Date.now()
    }

    /**
     * getData
     */
    public getData(): T {
        return this.data;
    }

    /**
     * getCachedAt
     */
    public getCachedAt(): number {
        return this.cachedAt;
    }
}