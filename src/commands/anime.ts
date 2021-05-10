import { MessageEmbed } from 'discord.js';
import { Command, CommandContext } from '../controllers/CommandHandler';
import { CommandCategory } from '../types/CommandTypes';
import { getRandomWaifu } from '../utils';


const cmd = new Command()
    .setName(`anime`)
    .setId(`841341267928809502`)
    .setDescription(`Küld egy anime képet.`)
    .setCategory(CommandCategory.FUN)
    .executes(async function (ctx: CommandContext) {
        let type = undefined;
        if (ctx.data.data.options) type = ctx.data.data.options[0].value;
        const embed = new MessageEmbed()
            .setTitle(`Anime`)
            .setTimestamp(Date.now())
            .setImage(await getRandomWaifu(type))
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        await ctx.replyEmbed(embed)
    })

export default cmd;