import { GuildMember, PartialGuildMember } from "discord.js";
import { Bot } from "../bot";
import Kick from "../models/Kick";

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
        const kick = (await Kick.find({
            member: member.user.id,
            hasRejoined: false
        }).sort({
            createdAt: -1
        }).limit(1).exec())[0];
        
        if (kick) {
            (kick as any).hasRejoined = true;
            kick.updateOne(kick).exec()
        }
    }

    /**
     * leave
     */
    public leave(member: GuildMember | PartialGuildMember) {
        
    }
}