import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { commands } from '../main';

export default {
    name: 'help',
    description: 'Kiírja a segítség menüt',
    id: '806205431058792469',
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Parancsok")
            .setColor('#ffffff')
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        for (const [key, value] of Object.entries(commands)) {
            embed.addField(`/${value.default.name}:`, value.default.description)
        }
        tc.send(embed)
    }
}