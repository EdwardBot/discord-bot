import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse, Member } from '../types/CommandResponse';
import { evaluate } from 'mathjs';
import { mkMsgDel } from '../main';
import { CommandCategory } from '../types/CommandTypes';

export default {
    name: `számol`,
    description: `Kiszámol egy műveletet.`,
    id: `807223957685403648`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.MISC,
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        if (data.data.options == undefined) return sendError(tc, data.member)
        try {
            const pingE = new MessageEmbed()
            .setTitle("Számológép")
            .addField("Művelet:", data.data.options[0].value)
            .addField("Eredmény:", evaluate(data.data.options[0].value))
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(pingE)
        } catch (e) {
            return sendError(tc, data.member)
        }
    }
}

async function sendError(tc: TextChannel, member: Member) {
    const purgeCE = new MessageEmbed()
        .setTitle("Hiba")
        .setDescription(`Használd így: \`/számol <művelet>\``)
        .setTimestamp(Date.now())
        .setFooter(`Lefuttatta: ${member.user.username}#${member.user.discriminator}`);

    const msg = await tc.send(purgeCE)
    const timeout = setTimeout(() => {
        msg.delete()
    }, 15000);
    mkMsgDel(msg, member.user.id);
}
