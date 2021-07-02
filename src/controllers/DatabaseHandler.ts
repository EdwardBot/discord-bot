import { TextChannel, User } from "discord.js";
import { Bot } from "../bot";

import { Client } from 'pg'

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
        this.client.on(`error`, (err) => console.error(err))
        this.client.on(`notice`, (n) => console.log(n.message))
        this.client.connect()
        process.on(`exit`, async () => {
            console.log(`Exit`);
            await this.client.end()
        })
    }

    /**
     * retrogen - Generates data to old servers
     */
    public retrogen() {
        console.log(`Retrogen`);

        this.bot.bot.guilds.cache.forEach(async (guild) => {
            await guild.members.fetch({
                limit: 1000
            })
            guild.members.cache.forEach(async (m) => {
                try {
                    if (!m.user.bot) {
                        const { rows } = await this.client.query(`select * from wallets where guild=$1 and userid=$2`, [guild.id, m.user.id])

                        if (rows.length > 0) return
                        await this.client.query(`insert into wallets (guild,userid) values ($1,$2)`, [guild.id, m.user.id])
                        console.log(`Created wallet for ${m.user.username}#${m.user.discriminator}(${m.user.id})!`);
                    }
                } catch (e) {
                    console.error(`Error: ${e}`)
                }
            })
            try {
                const { rows } = await this.client.query(`select * from "guild-configs" where "GuildId"=$1`, [guild.id])

                if (rows.length > 0) return;
                await this.client.query(`insert into "guild-configs" ("GuildId", "BotAdmins") values ($1,$2)`, [guild.id, [guild.ownerID]])
            } catch (e) {
                console.error(`Error: ${e}`)
            }
        })
    }

    /**
     * incrementCommandsRun
     */
    public async logCommandRun(name: string, author: User, channel: TextChannel) {
        try {
            await this.client.query(`INSERT INTO cmdlog (cmd, author, time, channel, guild) VALUES ($1, $2, now(), $3, $4)`, [
                name,
                author.id,
                channel.id,
                channel.guild.id
            ])
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * getCommandsRun returns the commands run with the bot
     */
    public async getCommandsRun(): Promise<string> {
        try {
            const row = await this.client.query(`SELECT COUNT(*) FROM cmdlog`)
            return `${row.rows[0].count}`
        } catch (e) {
            return `Hiba!`;
        }
    }

    /**
     * getCommandsRunInGuild
     */
    public async getCommandsRunInGuild(guildId: string): Promise<string> {
        try {
            const { rows } = await this.client.query(`SELECT COUNT(*) FROM cmdlog WHERE guild=$1`, [guildId])
            return rows[0].count
        } catch (e) {
            return `Hiba!`
        }
    }
}