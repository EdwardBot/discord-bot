import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { Bot } from "../bot";

export class JoinLeaveHandler {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
    }

    /**
     * init
     */
    public init() {
        this.bot.bot.on(`guildMemberAdd`, (m) => this.join(m))
        this.bot.bot.on(`guildMemberRemove`, (m) => this.leave(m))
        console.log(`Cucc`);
    }

    /**
     * join
     */
    public async join(member: GuildMember) {
        try {
            const { rows: r } = await this.bot.databaseHandler.client.query(`SELECT * FROM wallets WHERE guild=$1 AND userid=$2`, [member.guild.id, member.user.id])
            if (r.length == 0) {
                await this.bot.databaseHandler.client.query(`insert into wallets (guild,userid) values ($1,$2)`, [member.guild.id, member.user.id])
            }
            const { rows } = await this.bot.databaseHandler.client.query(`SELECT * FROM "guild-configs" WHERE "GuildId"=$1`, [member.guild.id])
            const data = rows[0]

            const allowed = ((data.AllowedFeatures as number) & 2) == 2
            if (allowed) {
                const channel = this.bot.getChannel(data.JoinChannel) as TextChannel
                if (channel == undefined) return
                channel.send(`Üdvözöllek a szerveren <@${member.user.id}>! <a:aWave:810086084343365662>`)
            }
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * leave
     */
    public async leave(member: GuildMember | PartialGuildMember) {
        try {
            const { rows } = await this.bot.databaseHandler.client.query(`SELECT * FROM "guild-configs" WHERE "GuildId"=$1`, [member.guild.id])
            const data = rows[0]

            const allowed = ((data.AllowedFeatures as number) & 1) == 1
            if (allowed) {
                const channel = this.bot.getChannel(data.LeaveChannel) as TextChannel
                if (channel == undefined) return
                channel.send(`Viszlát <@${member.user.id}>! <a:aWave:810086084343365662>`)
            }
        } catch (e) {
            console.error(e)
        }
    }
}