import { Client, TextChannel, MessageEmbed } from 'discord.js'
import { CommandResponse, Member } from '../types/CommandResponse'
import { getStatus } from 'mc-server-status'
import { mkMsgDel } from '../main'
import { CommandCategory } from '../types/CommandTypes'

export default {
    name: `mcszerver`,
    description: `Lekéri egy Minecraft szerver státuszát.`,
    id: `807671297504706560`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.MISC,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Minecraft Szerver Infó")
            .setDescription(`Lekérdezés...`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const msg = await tc.send(embed)

        if (data.data.options == undefined) return sendError(tc, data.member);
        if (data.data.options[0] == undefined) return sendError(tc, data.member);

        const ip = data.data.options[0].value;
        let hostname = ip;
        let port = 25565;
        let hasPort = false;
        if (ip.includes(`:`)) {
            hasPort = true;
            const arr = ip.split(`:`);
            hostname = arr[0];
            port = Number.parseInt(arr[1]);
        }

        (hasPort ? getStatus(hostname, port) : getStatus(hostname)).then((status) => {
            embed.setDescription(``)
                .addField(`Ping:`, `${status.ping}ms`)
                .addField(`Leírás:`, ((status.description as any).text ? (status.description as any).text : (status.description as any).extra[0].text).replace(/\xA7[0-9A-FK-OR]+/g, ""))
                .addField(`Verzió:`, status.version.name)
                .addField(`Játékosok:`, `${status.players.online}/${status.players.max}`)
                .addField(`Ip:`, `${hostname}${hasPort ? `:${port}` : ``}`)
            //.setThumbnail(status.favicon)
            msg.edit(embed);
        }).catch((err) => {
            embed.setDescription(`Lekérdezési hiba!`)
                .setColor(`RED`)
                .addField(`Ip:`, `${hostname}${hasPort ? `:${port}` : ``}`)

            msg.edit(embed);
        });
    }
}

async function sendError(tc: TextChannel, member: Member) {
    const purgeCE = new MessageEmbed()
        .setTitle("Hiba")
        .setTimestamp(Date.now())
        .setColor(`RED`)
        .setFooter(`Lefuttatta: ${member.user.username}#${member.user.discriminator}`);

    purgeCE.setDescription(`Használd így: \`/mcszerver <ip>\``)

    const msg = await tc.send(purgeCE)
    const timeout = setTimeout(() => {
        msg.delete()
    }, 15000);
    mkMsgDel(msg, member.user.id);
}
