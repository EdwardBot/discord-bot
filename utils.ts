import { timeStamp } from "console";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { User } from "./types/CommandResponse";

export async function noPermMsg(tc: TextChannel, user: User, perm: string) {
    const embed = new MessageEmbed()
    .setDescription(`Nincs jogod ehez!\nHiányzik a \`${perm}\` jogosúltságod`)
    .setTitle(`Hiba!`)
    .setColor(`RED`)
    .setTimestamp(Date.now())
    .setFooter(`Lefuttatta: ${user.username}#${user.discriminator}`);
    tc.startTyping();
    const sent = await tc.send(embed);
    tc.stopTyping();

    setTimeout(() => {
        sent.delete();
    }, 4000);
}

export function randomFromArray(arr: any[]): any {
    return arr[Math.floor(Math.random()*arr.length)];
}