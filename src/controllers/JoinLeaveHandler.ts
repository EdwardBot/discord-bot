import { GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { Bot } from "../bot";

export class JoinLeaveHandler {

    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
        bot.bot.on(`guildMemberAdd`, (m) => this.join(m))
        bot.bot.on(`guildMemberRemove`, (m) => this.leave(m))
        
    }

    /**
     * join
     */
    public async join(member: GuildMember) {
        //TODO add this back
        /*const kick = (await Kick.find({
            member: member.user.id,
            hasRejoined: false
        }).sort({
            createdAt: -1
        }).limit(1).exec())[0];
        
        if (kick) {
            (kick as any).hasRejoined = true;
            kick.updateOne(kick).exec()
        }*/

        try {
            const { rows } = await this.bot.databaseHandler.client.query(`SELECT * FROM "guild-configs" WHERE "GuildId"=$1`, [member.guild.id])
            const data = rows[0]

            console.log(JSON.stringify(data));
            

            const allowed = ((data.AllowedFeatures as number) & 2) == 2
            if (allowed) {
                const channel = this.bot.getChannel(data.JoinChannel) as TextChannel
                if (channel == undefined) return
                channel.send(`Üdvözöllek a szerveren <@${member.user.id}>! :wave:`)
            }
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * leave
     */
    public leave(member: GuildMember | PartialGuildMember) {
        
    }
}