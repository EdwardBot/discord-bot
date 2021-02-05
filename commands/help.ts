import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { commands } from '../main';
import * as config from '../botconfig.json';

export default {
    name: 'help',
    description: 'Kiírja a segítség menüt',
    id: '806205431058792469',
    requiesOwner: false,
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Parancsok")
            .setColor('#ffffff')
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const isOwner = data.member.user.id == config.owner_id;
        commands.forEach((value) => {
            if ((value.default.requiesOwner && isOwner) || !value.default.requiesOwner) {
                embed.addField(`/${value.default.name}:`, value.default.description)
            }
        })
        tc.send(embed)
    }
}