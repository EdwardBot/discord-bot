import axios from "axios";
import { GuildMember, MessageEmbed, UserResolvable } from "discord.js";
import { User } from "./types/CommandResponse";
import { SfwWaifu, sfwWaifus } from "./types/CommandTypes";

const noPerm = new MessageEmbed()
    .setTitle(`Hiba!`)
    .setColor(`RED`)
    .setTimestamp(Date.now())

export function noPermMsg(user: User, perm: string): MessageEmbed {
    return noPerm.setDescription(`Nincs jogod ehez!\nHiányzik a \`${perm}\` jogosúltságod`)
        .setFooter(`Lefuttatta: ${user.username}#${user.discriminator}`);
    
}

export async function getBadges(member: GuildMember) : Promise<string[]> {
    let badges = [];

    let flags = member.user.flags?.toArray()
    

    if (flags) {
        badges.push(...flags.map((value) => {
            switch (value) {
                case `HOUSE_BALANCE`:
                    return `<:Balance:834074650145194025>`

                case `HOUSE_BRAVERY`:
                    return `<:Bravery:834074651516338216>`

                case `HOUSE_BRILLIANCE`:
                    return `<:Brilliance:834074652070117407>`

                case `HYPESQUAD_EVENTS`:
                    return `<:HypeSquad_Events:834074651629191238>`

                case `EARLY_VERIFIED_BOT_DEVELOPER`:
                    return `<:Early_Verified_Bot_Developer:834074651620671528>`

                case `EARLY_SUPPORTER`:
                    return `<:Early_Supporter:834074651902083102>`

                case `PARTNERED_SERVER_OWNER`:
                    return `<:Partner:834074651637710938>`

                case `BUGHUNTER_LEVEL_1`:
                    return `<:Bughunter_Level1:834074651889106964>`

                case `BUGHUNTER_LEVEL_2`:
                    return `<:Bughunter_Level2:834074651847688223>`

                case `DISCORD_EMPLOYEE`:
                    return `<:Employee:834074651575189505>`

                case `PARTNERED_SERVER_OWNER`:
                    return `<:Partner:834074651637710938>`

                case `VERIFIED_BOT`:
                    return `<:Verified:834405935476506644>`
            }
        }))
    }
    
    return badges;
}

export function randomFromArray(arr: any[]): any {
    return arr[Math.floor(Math.random()*arr.length)];
}

export function randomWaifuType(): SfwWaifu {
    return randomFromArray(sfwWaifus);
}

export async function getRandomWaifu(type ?: SfwWaifu) : Promise<string> {
    let reqType : SfwWaifu;
    if (type != undefined) reqType = type;
    else reqType = randomWaifuType();
    const { data } = await axios.get(`https://waifu.pics/api/sfw/${reqType}`);
    return data.url;
}
