import { Client, Guild, GuildMember, User } from "discord.js";
import { CommandHandler } from "./controllers/CommandHandler";
import { DatabaseHandler } from "./controllers/DatabaseHandler";
import { JoinLeaveHandler } from "./controllers/JoinLeaveHandler";
import { botAdmins } from "../botconfig.json";

export class Bot {
    bot: Client
    commandHandler: CommandHandler
    databaseHandler: DatabaseHandler
    memberHandler: JoinLeaveHandler

    constructor() {
        this.bot = new Client({
            disableMentions: `everyone`,
            partials: [`MESSAGE`, `REACTION`, `GUILD_MEMBER`, `USER`]
        });
        this.commandHandler = new CommandHandler(this);
        this.databaseHandler = new DatabaseHandler(this);
        this.memberHandler = new JoinLeaveHandler(this);
    }

    /**
     * getDatabase
     */
    public getDatabase(): DatabaseHandler {
        return this.databaseHandler
    }

    /**
     * getGuild
     */
    public getGuild(guildId: string): Guild {
        return this.bot.guilds.cache.get(guildId);
    }

    /**
     * getUser
     */
    public getUser(member: string): User {
        return this.bot.users.cache.get(member);
    }

    /**
     * getGuildMember
     */
     public getGuildMember(guildId: string, userId: string): GuildMember {
        return this.bot.guilds.cache.get(guildId).members.cache.get(userId);
    }

    public async load() {
        console.log(`Loading EdwardBot`);
        await this.commandHandler.load();
        this.bot.on(`ready`, () => this.ready())
        //this.bot.on(`debug`, console.log)
        this.bot.on(`rateLimit`, (rate) => {
            console.log(`😒 a dc nem szeret. ${rate.limit} másodpercre letiltotta a ${rate.route}-ot!`)
        })
        this.bot.on(`message`, (msg) => {
            if (botAdmins.includes(msg.author.id) && msg.content.startsWith(`??`)) {
                //Handle tricks
                const cmd = msg.content.split(` `)[0].substring(2)
                const args = msg.content.split(` `).slice(1)

                this.commandHandler.runTrick(cmd, args, msg)
            }
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
