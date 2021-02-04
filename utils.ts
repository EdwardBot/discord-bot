import { timeStamp } from "console";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

export async function noPermMsg(tc: TextChannel, member: GuildMember, perm: string) {
    const embed = new MessageEmbed()
    .setDescription(`Nincs jogod ehez!\nHiányzik a \`${perm}\` jogosúltságod`)
    .setTitle(`Hiba!`)
    .setColor('RED')
    tc.startTyping();
    const sent = await tc.send(embed);
    tc.stopTyping();

    setTimeout(() => {
        sent.delete();
    }, 4000);
}