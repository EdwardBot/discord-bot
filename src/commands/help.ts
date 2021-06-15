import { MessageEmbed } from 'discord.js'
import { bot } from '../main'
import { categories, CommandCategory } from '../types/CommandTypes'
import { ActionRow, ButtonComponent, ButtonStyle, Command, CommandContext } from '../controllers/CommandHandler'
import { owner_id } from '../../botconfig.json'

function getCommandsForCategory(category: CommandCategory): Command[] {
    return bot.commandHandler.commands.array().filter((cmd) => cmd.category == category);
}

const idToCategory = {
    general: CommandCategory.GENERAL,
    moderation: CommandCategory.MODERATION,
    fun: CommandCategory.FUN,
    info: CommandCategory.INFO,
    music: CommandCategory.MUSIC,
    etc: CommandCategory.MISC
}

export default new Command()
    .setName(`help`)
    .setDescription(`Kiírja a segítség menüt`)
    .setId(`831498003361300490`)
    .setCategory(CommandCategory.GENERAL)
    .setOnClick((ctx: CommandContext, args: string[]) => {

        const embed = new MessageEmbed()
            .setColor(`#2ed573`)
            .setTimestamp(Date.now())
            .setAuthor(`EdwardBot`, bot.bot.user.avatarURL())
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);


        switch (args[0]) {
            case `allctg`:
                switch (args[1]) {
                    case `general`:
                        embed.setDescription(`Általános, nem kategorizálható parancsok.`)
                        break;

                    case `moderation`:
                        embed.setDescription(`Moderációs parancsok, amelyekel rendben tarthatod a szervered.`)
                        break;

                    case `fun`:
                        embed.setDescription(`Minedn ami fun.`)
                        break;

                    case `info`:
                        embed.setDescription(`Sok infó, hasznos, meg nem hasznos is.`)
                        break;

                    case `music`:
                        embed.setDescription(`Sok zene, meg minedn jó cucc.`)
                        break;

                    case `etc`:
                        embed.setDescription(`Főleg parancsok csak nekem.`)
                        break;
                }

                const commands = getCommandsForCategory(idToCategory[args[1]])

                if (commands.length == 0) {
                    embed.addField(`Parancsok:`, `\`\`\`Nincs parancs a kategóriában\`\`\``)
                } else {
                    embed.addField(`Parancsok:`, `\`\`\`${commands.map((e) => e.name).join(`\n`)}\`\`\``)
                }

                const row = new ActionRow()
                row.addComponent(new ButtonComponent(`Kategóriák`, ButtonStyle.PRIMARY).setCustomId(`ed_cmd_help_back_allctg`))

                ctx.addRow(row)
                ctx.replyEmbed(embed, true)
                break

            case `back`:
                embed.setTitle(`Segítség`)
                    .setDescription(`Elérhető kategóriák:`)
                    .addField(`Általános:`, `> Alap parancsok, amiket nem lehet besorolni.`)
                    .addField(`Moderáció:`, `> A szerver moderálásához szükséges parancsok.`)
                    .addField(`Szórakozás:`, `> Parancsok, hogy jól szórakozz.`)
                    .addField(`Infó:`, `> Sok hasznos dolgot eláruló parancsok.`)
                    .addField(`Zene:`, `> Hallgass rádiót, vagy általad választott zenét a hangcsatornákban.`)
                    .addField(`Egyéb:`, `> Ezeket nem tudom hova sorolni.`)

                const btns = new ActionRow();
                const btns2 = new ActionRow();

                btns.addComponent(new ButtonComponent("Általános", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_general`))

                btns.addComponent(new ButtonComponent("Moderáció", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_moderation`))

                btns.addComponent(new ButtonComponent("Szórakozás", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_fun`))

                btns2.addComponent(new ButtonComponent("Infó", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_info`))

                btns2.addComponent(new ButtonComponent("Zene", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_music`))

                btns2.addComponent(new ButtonComponent("Egyéb", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_etc`))

                ctx.addRow(btns)
                ctx.addRow(btns2)

                ctx.replyEmbed(embed, true)
                break
        }
    })
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

                const btns = new ActionRow();
                const btns2 = new ActionRow();

                btns.addComponent(new ButtonComponent("Általános", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_general`))

                btns.addComponent(new ButtonComponent("Moderáció", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_moderation`))

                btns.addComponent(new ButtonComponent("Szórakozás", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_fun`))

                btns2.addComponent(new ButtonComponent("Infó", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_info`))

                btns2.addComponent(new ButtonComponent("Zene", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_music`))

                btns2.addComponent(new ButtonComponent("Egyéb", ButtonStyle.PRIMARY)
                    .setCustomId(`ed_cmd_help_allctg_etc`))

                ctx.addRow(btns)
                ctx.addRow(btns2)
                break;

            case `dashboard`:
                embed.setTitle(`Dashboard`)
                    .setURL(`https://dashboard.edwardbot.tk/g/${ctx.data.guild_id}?ref=dashcmd&usr=${ctx.ranBy.user.id}`)
                    .setDescription(`A dashboardon mindent be tudsz állítani,\nde még nagyon kezdetleges.`)
                const row = new ActionRow();
                row.addComponent(new ButtonComponent("Megnyitás", ButtonStyle.LINK)
                    .setUrl(`https://dashboard.edwardbot.tk/guild/${ctx.data.guild_id}?ref=dashcmd&usr=${ctx.ranBy.user.id}`))
                ctx.addRow(row)
                break;

            case `rólunk`:
                embed.setTitle(`Rólunk`)
                    .addField(`Fejlesztő:`, `\`\`\`Bendi#2924\n \`\`\``, true)
                    .addField(`Tulajdonos:`, `\`\`\`Bendi#2924\nbtw_MDávid#9813\`\`\``, true)
                    .addField(`Egyéb hozzájárulás:`, `\`\`\`ICreeper12#1182\n \`\`\``, true)
                    .setDescription(`Ez a bot azért készült, mert unatkoztam.\n> Remélem hasznos lesz.`)

                const row2 = new ActionRow();

                row2.addComponent(new ButtonComponent(`Weboldal`, ButtonStyle.LINK)
                    .setUrl(`https://edwardbot.tk`))

                row2.addComponent(new ButtonComponent(`Kezelőfelület`, ButtonStyle.LINK)
                    .setUrl(`https://dashboard.edwardbot.tk/?ref=helpcmd`))

                row2.addComponent(new ButtonComponent(`Support Szerver`, ButtonStyle.LINK)
                    .setUrl(`https://dc.edwardbot.tk`))

                row2.addComponent(new ButtonComponent(`Meghívás`, ButtonStyle.LINK)
                    .setUrl(`https://invite.edwardbot.tk`))

                ctx.addRow(row2)
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
                        .addField(`Szükséges jogosultságok:`, `> [${cmd.requiedPermissions.map((i, n, a) => `\`${i}\`${n + 1 < a.length ? `,` : ``} `)}]`)
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

        ctx.replyEmbed(embed, true)
    });
