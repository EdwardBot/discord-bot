import { HTTPDataSource } from "./HTTPDataSource"

export type Meme = {
    title: string
    post_hint: string
    url: string
    permalink: string
}

export default new HTTPDataSource("meme")
    .setBuildFunction((source) => {
        source
        .setUrl(`https://www.reddit.com/user/bendimester_23/m/meme.json`)
        .setIntervall(3600000)
        .setMappingFunction((data) => {
            let tmp: Meme[] = [];
            (data.data.children as Array<any>).forEach((e) => {
                tmp.push(e.data)
            })
            data = tmp.filter((e) => e.post_hint == `image`)
            data.map(e => e.permalink = `https://reddit.com${e.permalink}`)
            return data;
        })
    })
    .init();
