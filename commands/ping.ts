import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { mkMsgDel } from '../main';
import { CommandResponse } from '../types/CommandResponse';
import { CommandCategory } from '../types/CommandTypes';

export default {
    name: `ping`,
    description: `Kiírja a bot pingjét`,
    id: `807640289522614332`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.MISC,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const pingE = new MessageEmbed()
            .setTitle(`Ping <a:pingpong:809463344481304577>`)
            .addField(`A bot pingje:`, `${bot.ws.ping}ms`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
            mkMsgDel(await tc.send(pingE), data.member.user.id)
    }
}