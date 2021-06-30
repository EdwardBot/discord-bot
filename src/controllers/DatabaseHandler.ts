import { MessageEmbed, TextChannel, User } from "discord.js";
import { connect } from "mongoose";
import { Bot } from "../bot";
import Config from "../models/Config";
import DeletableResponse from "../models/DeletableResponse";
import GuildConfig from "../models/GuildConfig";

import { Client } from 'pg'

export let commandsRun = 0;

/**
 * DatabaseHandler - Handles db stuff
 * @author Bendi
 */
export class DatabaseHandler {

    bot: Bot

    client: Client

    constructor(bot: Bot) {
        this.bot = bot;
        this.client = new Client({
            host: `45.135.56.198`,
            database: `edward`,
            user: `admin`,
            port: 5432,
            password: process.env.DBPASS,
            connectionTimeoutMillis: 10000,
            query_timeout: 10000,
            statement_timeout: 10000
        })
        //this.connect();
        this.client.on(`error`, (err) => console.error(err))
        this.client.on(`notice`, (n) => console.log(n.message))
        this.client.connect()
        process.on(`exit`, async () => {
            console.log(`Exit`);
            await this.client.end()
        })
    }

    /**
     * connect
     */
    public async connect() {
        console.trace(`Connect`)
        console.log(`Connecting to the db.`)
        try {
            await this.client.connect();
            console.log(`Connected!`);
            
        } catch (e) {
            console.log(`Db connection lost, reconnecting!`);
            const embed = new MessageEmbed()
                .setTitle(`Debug`)
                .setColor(`RED`)
                .setDescription(`Db connection lost, reconnecting!${e ? `\nError: ${e}` : ``}`);
            (this.bot.bot.channels.cache.get(`809097196267372555`) as TextChannel)?.send({
                embeds: [embed]
            });
            //setTimeout(() => this.connect(), 5000)
        }
    }

    /**
     * ready - Runs when the DB is ready
     * @author Bendi
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
    public async logCommandRun(name: string, author: User, channel: TextChannel) {
        console.log(`Igen`);
        try {
            console.log(`Inserted${(await this.client.query(`INSERT INTO cmdlog (cmd, author, time, channel, guild) VALUES ($1, $2, now(), $3, $4)`, [
                name,
                author.id,
                channel.id,
                channel.guild.id
            ])).rowCount} rows`)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * getCommandsRun
     */
    public async getCommandsRun(): Promise<string> {
        try {
            const row = await this.client.query(`SELECT COUNT(*) FROM cmdlog`)
            return `${row.rows[0].coutn}`
        } catch (e) {
            return `Hiba!`;
        }
    }
}