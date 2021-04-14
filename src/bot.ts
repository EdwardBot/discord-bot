import { Client } from "discord.js";
import { CommandHandler } from "./controllers/CommandHandler";
import { DatabaseHandler } from "./controllers/DatabaseHandler";

export class Bot {

    bot: Client
    commandHandler: CommandHandler
    databaseHandler: DatabaseHandler

    constructor() {
        this.bot = new Client({
            disableMentions: `everyone`,
            partials: [`MESSAGE`, `REACTION`, `GUILD_MEMBER`, `USER`]
        });
        this.commandHandler = new CommandHandler(this);
        this.databaseHandler = new DatabaseHandler(this);
    }

    public async load() {
        console.log(`Loading EdwardBot`);
        await this.commandHandler.load();
        this.bot.on(`ready`, () => this.ready())
        //this.bot.on(`debug`, console.log)
        this.bot.on(`rateLimit`, (rate) => {
            console.log(`😒 a dc nem szeret. ${rate.limit} másodpercre letiltotta a ${rate.route}-ot!`)
        })
        this.bot.login(process.env.TOKEN)
    }

    /**
     * getPing
     */
    public getPing(): number {
        return this.bot.ws.ping;
    }

    public async ready() {
        console.log(`Logged in as ${this.bot?.user?.username}#${this?.bot?.user?.discriminator}`);
        this.bot.user.setPresence({
            activity: {
                name: `a parancsokat ${this.bot.guilds.cache.size} szerveren | /help`,
                type: `WATCHING`
            }
        })
    }
}
