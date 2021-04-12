import { MessageEmbed } from 'discord.js';
import { evaluate } from 'mathjs';
import { mkMsgDel } from '../main';
import { CommandCategory } from '../types/CommandTypes';
import { Command, CommandContext } from '../controllers/CommandHandler';

async function sendError(ctx: CommandContext) {
    const embed = new MessageEmbed()
        .setTitle("Hiba")
        .setDescription(`Használd így: \`/számol <művelet>\``)
        .setTimestamp(Date.now())
        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

    await ctx.replyEmbed(embed)
    mkMsgDel(ctx.response.reply, ctx.ranBy.user.id);
}

const cmd = new Command()
    .setName(`számol`)
    .setDescription(`Kiszámol egy műveletet.`)
    .setId(`816262748341927976`)
    .setCategory(CommandCategory.MISC)
    .executes(async function(ctx: CommandContext) {
        if (ctx.data.data.options == undefined) return sendError(ctx)
        try {
            const embed = new MessageEmbed()
            .setTitle("Számológép")
            .addField("Művelet:", ctx.data.data.options[0].value)
            .addField("Eredmény:", evaluate(ctx.data.data.options[0].value))
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

            ctx.replyEmbed(embed)
        } catch (e) {
            return sendError(ctx)
        }
    })

export default cmd;
