import { Client, TextChannel, MessageEmbed, GuildMember } from 'discord.js';
import { mkMsgDel } from '../main';
import { CommandResponse, Member } from '../types/CommandResponse';

export default {
    name: 'törlés',
    description: 'Kitöröl x üzenetet.',
    id: '806944077560021003',
    requiesOwner: false,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        switch (data.data.options[0].name) {
            case "felhasználó":
                if (data.data.options == undefined) return sendError(tc, data.member, false);
                if (data.data.options[0] == undefined) return sendError(tc, data.member, false);
                if (data.data.options[0].options == undefined) return sendError(tc, data.member, false);
                if (data.data.options[0].options[0] == undefined) return sendError(tc, data.member, false);
                const userId = data.data.options[0].options[0].value;
                const msgs = (await tc.messages.fetch({
                    limit: 100
                })).filter((e) => e.author.id == userId);
                tc.bulkDelete(msgs)
                const purgeUE = new MessageEmbed()
                    .setTitle("Törlés")
                    .addField("Üzenetek törlölve tőle:", `<@${userId}>`)
                    .setColor("#1dd1a1")
                    .setTimestamp(Date.now())
                    .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
                const msg = await tc.send(purgeUE)
                const timeout = setTimeout(() => {
                    msg.delete()
                }, 15000);
                mkMsgDel(msg, data.member.user.id, timeout.ref());
                break;
            case "szám":
                const purgeCE = new MessageEmbed()
                    .setTitle("Ping")
                    .addField("A bot pingje:", `${bot.ws.ping}ms`)
                    .setTimestamp(Date.now())
                    .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
                tc.send(purgeCE)
                break;
        }
    }
}

async function sendError(tc: TextChannel, member: Member, isC: boolean) {
    const purgeCE = new MessageEmbed()
        .setTitle("Hiba")
        .setTimestamp(Date.now())
        .setFooter(`Lefuttatta: ${member.user.username}#${member.user.discriminator}`);
    if (isC) {
        purgeCE.setDescription('Használd így: `/törlés szám <darab>`')
    } else {
        purgeCE.setDescription('Használd így: `/törlés felhasználó <@valaki>`')
    }
    const msg = await tc.send(purgeCE)
    const timeout = setTimeout(() => {
        msg.delete()
    }, 15000);
    mkMsgDel(msg, member.user.id, timeout.ref());
}
