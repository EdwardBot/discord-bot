import { Channel, Client, Guild, GuildMember, MessageEmbed, TextChannel, User } from "discord.js";
import { CommandHandler } from "./controllers/CommandHandler";
import { DatabaseHandler } from "./controllers/DatabaseHandler";
import { JoinLeaveHandler } from "./controllers/JoinLeaveHandler";
import { botAdmins } from "../botconfig.json";
import GuildConfig from "./models/GuildConfig";
import Wallet from "./models/Wallet";

export class Bot {
    bot: Client
    commandHandler: CommandHandler
    databaseHandler: DatabaseHandler
    memberHandler: JoinLeaveHandler

    constructor() {
        this.bot = new Client({
            disableMentions: `everyone`,
            partials: [`MESSAGE`, `REACTION`, `GUILD_MEMBER`, `USER`],
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

    /**
     * getChannel
     */
    public getChannel(id: string): Channel {
        return this.bot.channels.cache.get(id);
    }

    public async load() {
        console.log(`Loading EdwardBot`);
        await this.commandHandler.load();
        this.bot.on(`ready`, () => this.ready())
        this.bot.on(`debug`, console.log)
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
            new GuildConfig({
                guildId: guild.id,
                joinedAt: Date.now(),
                allowLogging: false,
                allowWelcome: false,
                botAdmins: [guild.ownerID]
            }).save();
            const welcome = new MessageEmbed()
                .setTitle(`Üdvözöllek! <a:aWave:810086084343365662>`)
                .setDescription(`Köszi hogy hozzáadtál a szerveredhez!\n> Segítséget találhatsz a discord szerverünkön, vagy a dashboardunkon.\nA prefix /`)
                .setFooter(`EdwardBot`, this.bot.user.avatarURL())
            guild.systemChannel ? guild.systemChannel.send(welcome) : (guild.channels.cache.filter((c) => c.isText()).first() as TextChannel).send(welcome);
            this.updatePresence()
        })
        
        this.bot.on(`guildDelete`, async (guild) => {
            (await GuildConfig.findOne({
                guildId: guild.id
            })).deleteOne();
            this.updatePresence();
        })
        this.bot.login(process.env.TOKEN)
    }

    /**
     * updatePresence - Updates the bots presence
     */
    public updatePresence() {
        this.bot.user.setPresence({
            activity: {
                name: `a parancsokat ${this.bot.guilds.cache.size} szerveren | /help ${process.env.MODE == `DEV` ? `Fejlesztés alatt` : ``}`,
                type: `WATCHING`
            }
        })
    }

    /**
     * getPing
     */
    public getPing(): number {
        return this.bot.ws.ping;
    }

    /**
     * migrate - retrogen for db data
     */
    public async migrate() {
        console.log(`[RetroGen:main] Starting migration check.`);
        
        await this.bot.guilds.cache.forEach(async (g) => {
            const conf = await GuildConfig.findOne({
                guildId: g.id
            })
            if (conf == undefined) {
                console.log(`[RetroGen:guild] Generating for guild: '${g.name}'`);
                this.migrateGuild(g)
            }
            console.log(`[RetroGen:guild] Listing users for '${g.name}'`);
            await g.members.cache.forEach(async (m) => {
                if (m.user.bot) return
                const w = await Wallet.findOne({
                    guildId: g.id,
                    userId: m.user.id
                })

                if (w != undefined) return
                new Wallet({
                    guildId: g.id,
                    userId: m.user.id,
                    balance: 0,
                    xp: 0,
                    lvl: 0,
                    messages: 0
                }).save()
                console.log(`[RetroGen:wallet] Creating wallet for '${m.user.username}#${m.user.discriminator}'`);
            });
        })
        console.log(`[RetroGen:main] Finished migration check.`);
    }

    /**
     * migrateGuild- recreates the guild config for a guild
     */
    public migrateGuild(id: string | Guild) {
        const guild = typeof id == "string" ? this.getGuild(id) : id;
        new GuildConfig({
            guildId: guild.id,
            joinedAt: Date.now(),
            allowLogging: false,
            allowWelcome: false,
            botAdmins: [guild.ownerID]
        }).save();
    }

    public async ready() {
        console.log(`Logged in as ${this.bot?.user?.username}#${this?.bot?.user?.discriminator}`);
        this.updatePresence();
        setTimeout(async () => this.migrate())
    }
}
