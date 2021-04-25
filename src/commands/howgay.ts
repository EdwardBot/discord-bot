import { MessageEmbed } from 'discord.js'
import { owner_id } from '../../botconfig.json'
import { CommandCategory } from '../types/CommandTypes';
import { Command, CommandContext } from '../controllers/CommandHandler';

export default new Command()
    .setName(`hőmérő`)
    .setDescription(`Mennyire meleg az adott ember?`)
    .setId(`831516867305930783`)
    .setCategory(CommandCategory.FUN)
    .executes(async function(ctx: CommandContext) {
        const val = ctx.data.data.options ? ctx.data.data.options[0].value : ctx.data.member.user.id;

        let gay = Math.round(Math.random()*100);
        if (val == owner_id) gay = Math.floor(gay/4);
        if (val == ctx.data.member.user.id) gay = Math.floor(gay/2);

        const embed = new MessageEmbed()
            .setTitle("Hőmérő")
            .setDescription(`<@${val}> ${gay}% hogy meleg.`)
            .setTimestamp(Date.now())
            .setColor(gay > 50 ? `#ff9ff3` : `#1dd1a1`)
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        
        ctx.replyEmbed(embed)
    })
