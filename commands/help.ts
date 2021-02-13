import { Client, TextChannel, MessageEmbed } from 'discord.js'
import { CommandResponse } from '../types/CommandResponse'
import { commands, mkMsgDel } from '../main'
import * as config from '../botconfig.json'
import { CommandCategory } from '../types/CommandTypes'

export default {
    name: `help`,
    description: `Kiírja a segítség menüt`,
    id: `810106784392019968`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.GENERAL,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setColor(`#2ed573`)
            .setTimestamp(Date.now())
            .setAuthor(`EdwardBot`, bot.user.avatarURL())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        switch (data.data.options[0].name) {
            case `kategóriák`:
                embed.setTitle(`Segítség`)
                    .setDescription(`Elérhető kategóriák:`)
                    .addField(`Általános:`, `> Alap parancsok, amiket nem lehet besorolni.`)
                    .addField(`Moderáció:`, `> A szerver moderálásához szükséges parancsok.`)
                    .addField(`Szórakozás:`, `> Parancsok, hogy jól szórakozz.`)
                    .addField(`Infó:`, `> Sok hasznos dolgot eláruló parancsok.`)
                    .addField(`Zene:`, `> Hallgass rádiót, vagy általad választott zenét a hangcsatornákban.`)
                    .addField(`Egyéb:`, `> Ezeket nem tudom hova sorolni.`)
                break;

            case `dashboard`:
                embed.setTitle(`Dashboard`)
                    .setURL(`https://dashboard.edwardbot.tk/g/${data.guild_id}?ref=dashcmd&usr=${data.member.user.id}`)
                    .setDescription(`A dashboardon mindent be tudsz állítani,\nde még fejlesztjük.`)
                break;

            case `rólunk`:
                embed.setTitle(`Rólunk`)
                    .setURL(`https://edwardbot.tk/about`)
                    .addField(`Fejlesztő:`, `\`\`\`Bendi#2924\`\`\``, true)
                    .addField(`Tulajdonos:`, `\`\`\`Bendi#2924\nbtw_MDávid#9813\`\`\``, true)
                    .addField(`Egyéb hozzájárulás:`, `\`\`\`ICreeper12#1182\`\`\``, true)
                    .setDescription(`Ez a bot azért készült, mert unatkoztam.\n> Remélem hasznos lesz.`)
                break;

            case `kategória`:
                embed.setTitle(`Segítség`)
                switch (data.data.options[0].options[0].value) {
                    case `GENERAL`:
                        embed.setDescription(`Általános, nem kategorizálható parancsok.`)
                        break;

                    case `MODERATION`:
                        embed.setDescription(`Moderációs parancsok, amelyekel rendben tarthatod a szervered.`)
                        break;

                    case `FUN`:
                        embed.setDescription(`Minedn ami fun.`)
                        break;

                    case `INFO`:
                        embed.setDescription(`Sok infó, hasznos, meg nem hasznos is.`)
                        break;

                    case `MUSIC`:
                        embed.setDescription(`Sok zene, meg minedn jó cucc.`)
                        break;

                    case `MISC`:
                        embed.setDescription(`Főleg parancsok csak nekem.`)
                        break;
                }
                break;
        }
        //const isOwner = data.member.user.id == config.owner_id;
        //const user = tc.guild.member(data.member.user.id);
        //commands.forEach((value) => {
        //
        //    if ((value.requiesOwner && isOwner) || !value.requiesOwner) {
        //        let hasPerm = true;
        //        value.requiedPermissions.forEach((perm) => {
        //            if (user == undefined || user == null) {
        //                hasPerm = false;
        //            } else if (!user.hasPermission(perm)) hasPerm = false;
        //        })
        //        if (hasPerm) embed.addField(`/${value.name}:`, value.description)
        //    }
        //})

        mkMsgDel(await tc.send(embed), data.member.user.id)
    }
}