import { CovidResponse } from "../types/CovidResponse";
import { HTTPDataSource } from "./HTTPDataSource";

export default new HTTPDataSource("covid")
    .setBuildFunction((s) => {
        s
        .setUrl(`https://api.apify.com/v2/key-value-stores/RGEUeKe60NjU16Edo/records/LATEST?disableRedirect=true`)
        .setIntervall(6 * 1000 * 60 * 60)
        .setMappingFunction((e: CovidResponse) => e)
    })
    .init()
