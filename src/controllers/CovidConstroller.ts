import axios from "axios";
import { CovidResponse } from "../types/CovidResponse";

export class CovidApi {
    static INSTANCE: CovidApi

    res: CovidResponse
    at: number

    constructor() {
        CovidApi.INSTANCE = this;
    }

    /**
     * getData
     * @returns The covid data
     */
    public static async getData(): Promise<CovidResponse> {
        return await CovidApi.INSTANCE.get()
    }

    /**
     * get
     */
    public async get(): Promise<CovidResponse> {
        if (this.at < Date.now() - 18000000 || this.res == undefined || this.res == null) {
            this.at = Date.now()
            const resp = await axios.get(`https://api.apify.com/v2/key-value-stores/RGEUeKe60NjU16Edo/records/LATEST?disableRedirect=true`, {
                method: `GET`
            });
            this.res = (resp.data as CovidResponse);
        }
        return this.res
    }
}

new CovidApi()
