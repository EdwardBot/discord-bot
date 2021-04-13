import { MessageEmbed } from 'discord.js'
import { bot, mkMsgDel } from '../main'
import { categories, CommandCategory } from '../types/CommandTypes'
import { Command, CommandContext } from '../controllers/CommandHandler'
import { owner_id } from '../../botconfig.json'

function getCommandsForCategory(category: CommandCategory): Command[] {
    return bot.commandHandler.commands.array().filter((cmd) => cmd.category == category);
}

export default new Command()
    .setName(`help`)
    .setDescription(`Kiírja a segítség menüt`)
    .setId(`831498003361300490`)
    .setCategory(CommandCategory.GENERAL)
    .executes(async function (ctx: CommandContext) {
        const embed = new MessageEmbed()
            .setColor(`#2ed573`)
            .setTimestamp(Date.now())
            .setAuthor(`EdwardBot`, bot.bot.user.avatarURL())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);
        switch (ctx.data.data.options[0].name) {
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
                    .setURL(`https://dashboard.edwardbot.tk/g/${ctx.data.guild_id}?ref=dashcmd&usr=${ctx.ranBy.user.id}`)
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
                switch (ctx.data.data.options[0].options[0].value) {
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

            case `parancsok`:
                if (ctx.data.data.options[0].options) {
                    let cat = ctx.data.data.options[0].options[0].value as CommandCategory
                    const cmds = getCommandsForCategory(cat);
                    if (cmds.length == 0) {
                        embed.setDescription(`Nincs parancs a kategóriában.`)
                        break
                    }
                    embed.setTitle(`A(z) ${cat.toString()} parancsai`)
                    cmds.forEach((cmd) => embed.addField(cmd.name, `> ${cmd.description}`));
                } else {
                    categories.forEach((cat) => {
                        let tmp = "";
                        const cmds = getCommandsForCategory(cat);
                        if (cmds.length == 0) return;
                        cmds.forEach((cmd) => tmp += cmd.name + `\n`);
                        embed.addField(cat.toString(), `\`\`\`${tmp}\`\`\``, true)
                    })
                }
                break;

            case `parancs`:
                const cmd = bot.commandHandler.commands.array().find((c) => c.name == ctx.data.data.options[0].options[0].value.toLowerCase());
                if (cmd) {
                    let canRun = true;

                    if (cmd.requiesOwner && ctx.ranBy.user.id != owner_id) {
                        canRun = false
                    } else {
                        cmd.requiedPermissions.forEach((e) => {
                            if (!ctx.ranBy.hasPermission(e)) {
                                canRun = false
                                return
                            }
                        })
                    }
                    embed.setTitle(`**${cmd.name}**`)
                        .addField(`Leírás:`, `> ${cmd.description}`)
                        .addField(`Kategória:`, `> ${cmd.category.toString()}`)
                        .addField(`Szükséges jogosultságok:`, `> [${cmd.requiedPermissions.map((i,n,a) => `\`${i}\`${n + 1 < a.length ? `,` : ``} `)}]`)
                        .addField(`Csak a tulaj használhatja: `, `> ${cmd.requiesOwner ? `Igen` : `Nem`}`)
                        .addField(`Használhatod-e?`, canRun ? `> Igen` : `> Nem`)
                        .setColor(canRun ? `GREEN` : `RED`)
                } else {
                    embed.setTitle(`Hiba`)
                        .setDescription(`Nincs ilyen parancs!`)
                        .setColor(`RED`)
                }
                
                break;
        }
        
        ctx.replyEmbed(embed)
        mkMsgDel(ctx.response.reply, ctx.data.member.user.id)
    })
