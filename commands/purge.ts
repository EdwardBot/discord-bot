import { Client, TextChannel, MessageEmbed, GuildMember, Collection, Message } from 'discord.js';
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
                let msgs = (await tc.messages.fetch({
                    limit: 100
                })).filter((e) => e.author.id == userId).array();
                let last = msgs[msgs.length - 1];

                const loading = new MessageEmbed()
                    .setTitle("Törlés")
                    .setDescription(`Törlés...`)
                    .setColor("#1dd1a1")
                    .setTimestamp(Date.now())
                    .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
                const msg = await tc.send(loading)

                while (last.createdTimestamp + 1209600000 > Date.now() && msgs.length < 100) {
                    const msgss = (await tc.messages.fetch({
                        limit: 100,
                        before: last.id
                    })).filter((e) => e.author.id == userId).array();
                    msgss.forEach((e) => msgs.push(e));
                    if (msgs[msgs.length - 1].createdTimestamp == last.createdTimestamp) break;
                    last = msgs[msgs.length - 1];
                }
                let max = Infinity;
                if (data.data.options[0].options[1] != undefined) {
                    try {
                        max = Number.parseInt(data.data.options[0].options[1].value);
                    }catch (e) {
                        max = Infinity;
                    }
                }
                for (let i = 0; i < Math.ceil(msgs.length/100); i++) {
                        tc.bulkDelete(msgs.slice(i*100,i*100+99 > max ? max : i*100+99), true).catch((e) => {
                            console.log(`error deleting messages: \n ${e}`);
                        })
                }
                const embed = new MessageEmbed()
                    .setTitle("Törlés")
                    .addField(`${Math.min(msgs.length, max)} üzenet törlölve tőle:`, `<@${userId}>`)
                    .setColor("#1dd1a1")
                    .setTimestamp(Date.now())
                    .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
                await msg.edit(embed);
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
