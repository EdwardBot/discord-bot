import axios from "axios";
import { ApplicationResolvable, VoiceChannel } from "discord.js";
import { ActionRow, ButtonComponent, ButtonStyle, Command, CommandContext } from "../controllers/CommandHandler";
import { CommandCategory } from "../types/CommandTypes";

export default new Command()
    .setName(`játék`)
    .setDescription(`Többjátékos játék indítása hangcsatornában.`)
    .setId(`833304929421754389`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading();

        const game_id = ctx.data.options.array()[0].value;
        const channel_id = ctx.data.options.array()[1].value;

        const channel = ctx.ranBy.guild.channels.cache.get(channel_id as `${bigint}`)

        if (channel) {
            if (channel.type == `voice`) {
                const data = await channel.createInvite({
                    targetType: 2,
                    targetApplication: game_id as ApplicationResolvable
                })
                const r = new ActionRow();
                r.addComponent(new ButtonComponent(`Csatlakozás`, ButtonStyle.LINK).setUrl(`https://discord.gg/${data.code}`))
                ctx.addRow(r)
                ctx.replyString(`** **`)
            } else {
                ctx.replyString(`Kérlek hangcsatornát válassz!`)
            }
        } else {
            ctx.replyString(`Hiba, a csatorna nem található!`);
        }

    })
