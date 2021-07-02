import { Channel, Client, Guild, GuildMember, MessageEmbed, TextChannel, User } from "discord.js";
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
            partials: [ "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
            intents: [ "GUILD_MESSAGES", "GUILDS", `GUILD_MEMBERS`, `GUILD_BANS`, `GUILD_MESSAGE_REACTIONS` ]
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
    public getGuild(guildId: `${bigint}`): Guild {
        return this.bot.guilds.cache.get(guildId);
    }

    /**
     * getUser
     */
    public getUser(member: `${bigint}`): User {
        return this.bot.users.cache.get(member);
    }

    /**
     * getGuildMember
     */
     public getGuildMember(guildId: `${bigint}`, userId: `${bigint}`): GuildMember {
        return this.bot.guilds.cache.get(guildId).members.cache.get(userId);
    }

    /**
     * getChannel
     */
    public getChannel(id: `${bigint}`): Channel {
        return this.bot.channels.cache.get(id);
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
                return
            }
        })
        //Temp
        this.bot.on(`guildCreate`, (guild) => {
            try {
                this.databaseHandler.client.query(`insert into "guild-configs" ("GuildId", "BotAdmins") values ($1,$2)`, [guild.id, [guild.ownerID]])
            } catch (e) {
                console.error(e)
            }
            const welcome = new MessageEmbed()
                .setTitle(`Üdvözöllek! <a:aWave:810086084343365662>`)
                .setDescription(`Köszi hogy hozzáadtál a szerveredhez!\n> Segítséget találhatsz a discord szerverünkön, vagy a dashboardunkon.\nA prefix /`)
                .setFooter(`EdwardBot`, this.bot.user.avatarURL())
            guild.systemChannel ? guild.systemChannel.send({
                embeds: [welcome]
            }) : (guild.channels.cache.filter((c) => c.isText()).first() as TextChannel).send({
                embeds: [welcome]
            });
            this.updatePresence()
        })
        
        this.bot.on(`guildDelete`, async (guild) => {
            try {
                this.databaseHandler.client.query(`delete from "guild-configs" where "GuildId"=$1`, [guild.id])
            } catch (e) {
                console.error(e)
            }
            this.updatePresence();
        })
        this.memberHandler.init()
        this.bot.login(process.env.TOKEN)
    }

    /**
     * updatePresence - Updates the bots presence
     */
    public updatePresence() {
        this.bot.user.setPresence({
            activities: [{
                name: `a parancsokat ${this.bot.guilds.cache.size} szerveren | /help ${process.env.PRODUCION == `` ? `Fejlesztés alatt` : ``}`,
                type: `WATCHING`,
                url: `https://edwardbot.tk`
            }]
        })
    }

    /**
     * getPing
     */
    public getPing(): number {
        return this.bot.ws.ping;
    }

    public async ready() {
        console.log(`Logged in as ${this.bot?.user?.username}#${this?.bot?.user?.discriminator}`);
        this.updatePresence();
        this.databaseHandler.retrogen()
    }

    /**
     * getColor
     */
    public getColor(g: Guild): number {
        return g.members.cache.get(this.bot.user.id).roles.highest.color
    }
}
