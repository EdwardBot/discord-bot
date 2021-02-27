import { Client, TextChannel, MessageEmbed } from 'discord.js'
import { CommandResponse } from '../types/CommandResponse'
import { CommandCategory } from '../types/CommandTypes';

export default {
    name: `pénzfeldobás`,
    description: `Fej vagy írás.`,
    id: `808009325989331014`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.FUN,
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const val = data.data.options[0].value;
        const res = Math.random() > 0.5;

        const win = (res && val == `HEAD`) || (!res && val == `WRITING`);

        const embed = new MessageEmbed()
            .setTitle("Pénzfeldobás")
            .addField("A tipped:", val == `HEAD` ? "Fej" : "Írás")
            .addField(`Az eredmény:`, res ? `Fej` : `Írás`)
            .setDescription(win ? `Nyertél` : `Vesztettél`)
            .setTimestamp(Date.now())
            .setColor(win ? `#10ac84` : `#ee5253`)
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(embed)
    }
}