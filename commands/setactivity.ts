import { Client, TextChannel, MessageEmbed, ActivityType } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { commands } from '../main';
import * as config from '../botconfig.json';
import { noPermMsg } from '../utils';

export default {
    name: 'setactivity',
    description: 'Beállítja a bot elfoglaltságát. Csak Bendi használhatja!',
    id: '806853316474699796',
    requiesOwner: true,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        if (data.member.user.id != config.owner_id) {
            noPermMsg(tc, data.member.user, `BOT_TULAJ`);
            return;
        }
        const oldA = bot.user.presence.activities[0];
        bot.user.setPresence({
            activity: {
                type: (data.data.options[0].value as ActivityType),
                name: data.data.options[1].value
            },
            status: 'online'
        });
        const setAE = new MessageEmbed()
            .setTitle("Elfoglatság beállítva!")
            .addField("Régi elfoglaltság:", `${translateActivity(oldA.type)}: ${oldA.name}`)
            .addField("Új elfoglaltság:", `${translateActivity(data.data.options[1].name as any)}: ${data.data.options[1].value}`)
            .setColor('WHITE')
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const sent = await tc.send(setAE);
        setTimeout(() => {
            sent.delete();
        }, 5000);
    }
}

function translateActivity(activity: ActivityType): string {
    switch (activity) {
        case 'PLAYING':
            return 'Játékban';
        case 'STREAMING': 
            return 'Közvetít';
        case 'LISTENING':
            return 'Hallgatja';
        case 'WATCHING':
            return 'Nézi';
        case 'COMPETING': 
            return 'Versenyez';
        default:
            return 'Játékban';
    }
}