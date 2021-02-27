import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { mkMsgDel } from '../main';
import { CommandResponse } from '../types/CommandResponse';
import { CommandCategory } from '../types/CommandTypes';
import { getRandomWaifu } from '../utils';

export default {
    name: `anime`,
    description: `Küld egy anime képet.`,
    id: `811236631259643954`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.FUN,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        let type = undefined;
        if (data.data.options) type = data.data.options[0].value;
        
        const embed = new MessageEmbed()
            .setTitle(`Anime`)
            .setTimestamp(Date.now())
            .setImage(await getRandomWaifu(type))
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        mkMsgDel(await tc.send(embed), data.member.user.id)
    }
}