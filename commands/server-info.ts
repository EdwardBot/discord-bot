import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';

export default {
    name: 'szerverinfó',
    description: 'Kiírja a szerver információit.',
    id: '807650084006789140',
    requiesOwner: false,
    requiedPermissions: [],
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const user = tc.guild.members.cache.get(data.member.user.id);

        const embed = new MessageEmbed()
            .setTitle("Szerver Infó")
            .addField(`A szerver neve:`, tc.guild.name, true)
            .addField(`Tulajdonos:`, `${tc.guild.owner.user.username}#${tc.guild.owner.user.discriminator}`, true)
            .addField(`Szerver ID:`, tc.guild.id, true)
            .addField(`Tagok (összes):`, tc.guild.members.cache.size, true)
            .addField(`Tagok (nem bot):`, tc.guild.members.cache.filter((u) => !u.user.bot).size, true)
            .addField(`Tagok (bot):`, tc.guild.members.cache.filter((u) => u.user.bot).size, true)
            .addField(`Rangok:`, tc.guild.roles.cache.size, true)
            .addField(`Emojik:`, tc.guild.emojis.cache.size, true)
            .addField(`Szerver régiója:`, tc.guild.region, true)
            .addField(`Csatornák:`, tc.guild.channels.cache.size, true)
            .addField(`Szöveges csatornák:`, tc.guild.channels.cache.filter((ch) => ch.isText()).size, true)
            .addField(`Hang csatornák:`, tc.guild.channels.cache.filter((ch) => !ch.isText()).size, true)
            .setThumbnail(tc.guild.iconURL())
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);

        if (user.hasPermission('MANAGE_GUILD')) {
            embed.setURL(`https://dashboard.edwardbot.tk/g/${tc.guild.id}?ref=srvinf&user=${user.user.id}`)
        }
        tc.send(embed);
    }
}