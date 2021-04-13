import axios from "axios"

export class MemeController {
    static INSTANCE: MemeController
    static readonly URL: string = `https://www.reddit.com/user/bendimester_23/m/meme.json`

    data: Meme[]
    fetchedAt: number

    constructor() {
        MemeController.INSTANCE = this
        this.data = []
        this.fetch()
    }

    /**
     * fetch
     */
    public async fetch() {
        let tmp: Meme[] = []
        this.fetchedAt = Date.now()
        const { data } = await axios.get(MemeController.URL);
        (data.data.children as Array<any>).forEach((e) => {
            tmp.push(e.data)
        })
        this.data = tmp.filter((e) => e.post_hint == `image`)
        this.data.map(e => e.permalink = `https://reddir.com${e.permalink}`)
    }

    /**
     * getRandom
     */
    public static getRandom(): Meme {
        return MemeController.INSTANCE.get()
    }

    private get(): Meme {
        if (this.fetchedAt + 3600000 < Date.now()) {
            this.fetch()
        }
        return this.data[Math.floor(Math.random() * this.data.length)]
    }
}

export type Meme = {
    title: string
    post_hint: string
    url: string
    permalink: string
}

new MemeController()
