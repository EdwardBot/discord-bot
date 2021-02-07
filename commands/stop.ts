import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import * as config from '../botconfig.json';
import { noPermMsg } from '../utils';

export default {
    name: 'stop',
    description: 'Leállítja a botot. Csak bendi használhatja!',
    id: '807647846807240704',
    requiesOwner: true,
    requiedPermissions: [],
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        if (data.member.user.id != config.owner_id) {
            noPermMsg(tc, data.member.user, `BOT_TULAJ`);
            return;
        }
        const pingE = new MessageEmbed()
            .setTitle("Stop")
            .setDescription("A bot 5 másodpercen belül leáll!")
            .setColor('RED')
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const msg = await tc.send(pingE);
        setTimeout(async () => {
            await msg.delete()
            process.exit(0);
        }, 4500);
    }
}