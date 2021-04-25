import { MessageEmbed } from 'discord.js'
import { Command, CommandContext } from '../controllers/CommandHandler';
import { CommandCategory } from '../types/CommandTypes';

const cmd = new Command()
    .setName(`pénzfeldobás`)
    .setDescription(`Fej vagy írás.`)
    .setId(`831220744783527957`)
    .setCategory(CommandCategory.FUN)
    .executes(async function(ctx: CommandContext) {
        const val = ctx.data.data.options[0].value;
        const res = Math.random() > 0.5;

        const win = (res && val == `HEAD`) || (!res && val == `WRITING`);

        const embed = new MessageEmbed()
            .setTitle("Pénzfeldobás")
            .addField("A tipped:", val == `HEAD` ? "Fej" : "Írás")
            .addField(`Az eredmény:`, res ? `Fej` : `Írás`)
            .setDescription(win ? `Nyertél` : `Vesztettél`)
            .setTimestamp(Date.now())
            .setColor(win ? `#10ac84` : `#ee5253`)
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        ctx.replyEmbed(embed)
    });

export default cmd;
