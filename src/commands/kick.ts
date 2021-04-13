import { MessageEmbed } from 'discord.js';
import { Command, CommandContext } from '../controllers/CommandHandler';
import { CommandCategory } from '../types/CommandTypes';

export default new Command()
    .setName(`kick`)
    .setDescription(`Kirúg egy embert.`)
    .setId(`807565939200753666`)
    .addRequiredPermission(`KICK_MEMBERS`)
    .setCategory(CommandCategory.MODERATION)
    .executes(async function(ctx: CommandContext) {
        const embed = new MessageEmbed()
            .setTitle("Ping")
            .setDescription(`Not implemented`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        ctx.replyEmbed(embed)
    })
