import axios from "axios"

export class HTTPDataSource {

    name: string
    url: string
    fetchInterval: number
    processFunction: Function
    result: any

    constructor (name: string) {
        this.url = ""
        this.name = name
        this.fetchInterval = -1
        this.processFunction = (e) => e;
    }

    /**
     * fetch - fetches the data
     */
    public async fetch() {
        console.log(`[HTTPDataSource:${this.name}] Fetching data...`)
        const start = Date.now();
        const { data, status } = await axios.get(this.url)
        if (status != 200) {
            throw new Error(`[HTTPDataSource:${this.name}] Non 200 status code recieved!\nCode: ${status}\nMessage: ${data}`)
        }
        this.result = this.processFunction(data)
        console.log(`[HTTPDataSource:${this.name}] Fetched data in ${Date.now() - start}ms`)
        if (this.fetchInterval > 0) {
            setTimeout(this.fetch, this.fetchInterval)
        }
    }

    /**
     * getData
     */
    public getData(): any {
        return this.result
    }

    /**
     * setUrl
     */
    public setUrl(url: string): HTTPDataSource {
        this.url = url
        return this
    }

    /**
     * setMappingFunction
     */
    public setMappingFunction(fun: Function): HTTPDataSource {
        this.processFunction = fun
        return this
    }

    /**
     * setIntervall
     */
    public setIntervall(intervall: number): HTTPDataSource {
        this.fetchInterval = intervall
        return this
    }

    /**
     * init
     */
    public init(): HTTPDataSource {
        this.fetch()
        return this
    }
}