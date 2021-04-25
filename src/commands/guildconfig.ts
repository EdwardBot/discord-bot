import { MessageEmbed } from 'discord.js';
import { Command, CommandContext } from '../controllers/CommandHandler';
import { bot, mkMsgDel } from '../main';
import { CommandCategory } from '../types/CommandTypes';

export default new Command()
    .setName(`guildConfig`)
    .setDescription(`A bot beállításainak kezelése.`)
    .setId(`807640289522614332`)
    .setCategory(CommandCategory.MISC)
    .executes(async function (ctx: CommandContext) {
        const embed = new MessageEmbed()
            .setTitle(`Ping <a:pingpong:809463344481304577>`)
            .addField(`A bot pingje:`, `${bot.bot.ws.ping}ms`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

        ctx.replyEmbed(embed)
         mkMsgDel(ctx.response.reply, ctx.ranBy.user.id)
    })
