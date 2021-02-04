import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';

export default {
    name: 'ping',
    description: 'Kiírja a bot pingjét',
    id: '806205374914625576',
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const pingE = new MessageEmbed()
            .setTitle("Ping")
            .addField("A bot pingje:", `${bot.ws.ping}ms`)
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(pingE)
    }
}