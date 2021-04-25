import { MessageEmbed, TextChannel } from "discord.js";
import { connect } from "mongoose";
import { Bot } from "../bot";
import Config from "../models/Config";
import DeletableResponse from "../models/DeletableResponse";
import GuildConfig from "../models/GuildConfig";

export let commandsRun = 0;
export class DatabaseHandler {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
        this.connect()
        this.retrogen();
        this.clean()
    }

    /**
     * connect
     */
    public connect() {
        console.log(`Connecting to the db.`)
        connect(`${process.env.MONGODB}/edward?retryWrites=true&w=majority`, {
            appname: `EdwardBot`,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                console.log(`Db connection lost, reconnecting!`);
                const embed = new MessageEmbed()
                    .setTitle(`Debug`)
                    .setColor(`RED`)
                    .setDescription(`Db connection lost, reconnecting!${err ? `\nError: ${err.message}` : ``}`);
                (this.bot.bot.channels.cache.get(`809097196267372555`) as TextChannel)?.send(embed);
                setTimeout(() => this.connect(), 5000);
            } else {
                console.log(`Connected to the db.`);
                this.ready()
            }
        });
    }

    /**
     * ready - Runs when the DB is ready
     */
    public async ready() {
        let ran = await Config.findOne({
            key: `stats.commands_run`
        });
        if (ran == null || ran == undefined) {
            const asd = new Config({
                key: `stats.commands_run`,
                value: `100`
            })
            ran = await asd.save();
        }
        commandsRun = Number.parseInt((ran.toObject() as any).value)
        this.updateCommandsRun()
    }

    /**
     * retrogen - Generates data to old servers
     */
    public retrogen() {
        this.bot.bot.guilds.cache.forEach(async (guild) => {
            const d = await GuildConfig.findOne({
                guildId: guild.id
            }).catch((err) => {
                console.log(`DB Error: ${err}`)
            });
            if (!d) {
                console.log(`retrogen for ${guild.name}`)
                new GuildConfig({
                    guildId: guild.id,
                    joinedAt: Date.now(),
                    allowLogging: false,
                    allowWelcome: false,
                    botAdmins: [guild.ownerID]
                }).save();
            }
        })
    }

    /**
     * updateCommandsRun
     */
    public async updateCommandsRun() {
        const obj = await Config.findOne({
            key: `stats.commands_run`
        });
        await obj.updateOne({
            key: `stats.commands_run`,
            value: `${commandsRun}`
        })
        setTimeout(() => this.updateCommandsRun(), 20000)
    }

    private async clean() {
        //Clean the database
        //First clear deletable messages
        let cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 1)
        DeletableResponse.deleteMany({ createdAt: { $lte: cutoff.getTime() } });

        //Do the same later
        setTimeout(() => this.clean(), 3600000)
    }

    /**
     * incrementCommandsRun
     */
    public incrementCommandsRun() {
        commandsRun++;
    }
}