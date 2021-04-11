import { Client } from "discord.js";
import { CommandHandler } from "./controllers/CommandHandler";

export class Bot {
    bot: Client
    commandHandler: CommandHandler

    constructor() {
        this.bot = new Client({
            disableMentions: `everyone`,
            partials: [`MESSAGE`, `REACTION`, `GUILD_MEMBER`, `USER`]
        });
        this.commandHandler = new CommandHandler(this);
    }

    public async load() {
        console.log(`Loading EdwardBot`);
        await this.commandHandler.load();
        this.bot.on(`ready`, () => this.ready())
        this.bot.on(`debug`, console.log)
        this.bot.login(process.env.TOKEN)
    }

    public async ready() {
        console.log(`Logged in as ${this.bot?.user?.username}#${this?.bot?.user?.discriminator}`);
    }
}
