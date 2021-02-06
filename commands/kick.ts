import { Client, TextChannel, MessageEmbed, PermissionString } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';

export default {
    name: 'kick',
    description: 'Kirúg egy embert.',
    id: '807565939200753666',
    requiesOwner: false,
    requiedPermissions: [ ('KICK_MEMBERS' as PermissionString) ],
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const pingE = new MessageEmbed()
            .setTitle("Ping")
            .addField("A bot pingje:", `${bot.ws.ping}ms`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(pingE)
    }
}