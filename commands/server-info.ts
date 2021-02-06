import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';

export default {
    name: 'szerverinfó',
    description: 'Kiírja a szerver információit.',
    id: '807604468584546386',
    requiesOwner: false,
    requiedPermissions: [],
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const pingE = new MessageEmbed()
            .setTitle("Szerver Infó")
            .addField(`A szerver neve:`, tc.guild.name)
            .addField(`Tulajdonos:`, `${tc.guild.owner.user.username}#${tc.guild.owner.user.discriminator}`)
            .setThumbnail(tc.guild.iconURL())
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(pingE)
    }
}