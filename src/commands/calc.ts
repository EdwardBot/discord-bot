import { MessageEmbed } from 'discord.js';
import nerdamer from 'nerdamer'
import { CommandCategory } from '../types/CommandTypes';
import { Command, CommandContext } from '../controllers/CommandHandler';

async function sendError(ctx: CommandContext, b: boolean) {
    if (b) {
        const embed = new MessageEmbed()
        .setTitle("Hiba")
        .setDescription(`Hibás, vagy kiszámíthatatlan művelet!`)
        .setTimestamp(Date.now())
        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        await ctx.replyEmbed(embed)
        return
    }
    const embed = new MessageEmbed()
        .setTitle("Hiba")
        .setDescription(`Használd így: \`/számol <művelet>\``)
        .setTimestamp(Date.now())
        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

    await ctx.replyEmbed(embed)
}

const cmd = new Command()
    .setName(`számol`)
    .setDescription(`Kiszámol egy műveletet.`)
    .setId(`816262748341927976`)
    .setCategory(CommandCategory.MISC)
    .executes(async function(ctx: CommandContext) {
        if (ctx.data.data.options == undefined) return sendError(ctx, false)
        const input = ctx.data.data.options[0].value;
        try {
            const output = nerdamer(input).evaluate().text()
            const embed = new MessageEmbed()
            .setTitle("Számológép")
            .addField("Művelet:", ctx.data.data.options[0].value)
            .addField("Eredmény:", output)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

            ctx.replyEmbed(embed)
        } catch (e) {
            return sendError(ctx, true)
        }
    })

export default cmd;
