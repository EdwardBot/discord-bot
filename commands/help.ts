import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { commands } from '../main';
import * as config from '../botconfig.json';

export default {
    name: 'help',
    description: 'Kiírja a segítség menüt',
    id: '806205431058792469',
    requiesOwner: false,
    requiedPermissions: [],
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Parancsok")
            .setColor('#2ed573')
            .setTimestamp(Date.now())
            .setAuthor('EdwardBot', bot.user.avatarURL())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const isOwner = data.member.user.id == config.owner_id;
        const user = tc.guild.member(data.member.user.id);
        commands.forEach((value) => {
            
            if ((value.requiesOwner && isOwner) || !value.requiesOwner) {  
                let hasPerm = true;
                value.requiedPermissions.forEach((perm) => {
                    if (user == undefined || user == null) {
                        hasPerm = false;
                    }else if (!user.hasPermission(perm)) hasPerm = false;
                })
                if (hasPerm) embed.addField(`/${value.name}:`, value.description)
            }
        })
        tc.send(embed)
    }
}