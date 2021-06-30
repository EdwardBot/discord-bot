import axios from "axios";
import { VoiceChannel } from "discord.js";
import { Command, CommandContext } from "../controllers/CommandHandler";
import { CommandCategory } from "../types/CommandTypes";

export default new Command()
    .setName(`játék`)
    .setDescription(`Többjátékos játék indítása hangcsatornában.`)
    .setId(`833304929421754389`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading();

        const game_id = ctx.data.data.options[0].value;
        const channel_id = ctx.data.data.options[1].value;

        const channel = ctx.ranBy.guild.channels.cache.get(channel_id as `${bigint}`)

        if (channel) {
            if (channel instanceof VoiceChannel) {
                const { data } = await axios.post(`https://discord.com/api/v6/channels/${channel_id}/invites`, {
                    target_type: 2,
                    target_application_id: game_id
                }, {
                    headers: {
                        'Authorization': `Bot ${process.env.TOKEN}`
                    }
                })
                ctx.replyString(`Itt az invite: https://discord.gg/${data.code}`)
            } else {
                ctx.replyString(`Csak hang csatornában használható.`)
            }
        } else {
            ctx.replyString(`Hiba, a csatorna nem található!`);
        }

    })
