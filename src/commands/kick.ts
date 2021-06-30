import { MessageEmbed } from 'discord.js';
import { ActionRow, ButtonComponent, ButtonStyle, Command, CommandContext } from '../controllers/CommandHandler';
import { bot } from '../main';
import Kick from '../models/Kick';
import { ButtonInteraction, CommandCategory } from '../types/CommandTypes';

const embed = new MessageEmbed()
    .setTitle(`Ki lettél dobva!`)
    .setColor(`RED`);

const SEARCHING_MEMBERS = new MessageEmbed()
    .setTitle(`Keresés! <a:edloading:853582551750803466>`)
    .setDescription(`Emberek keresése!\nEz eltarthat egy kis ideig!`)
    .setColor(`#1dd1a1`)

const MASS_KICKING_CANCELED = new MessageEmbed()
    .setTitle(`Kidobás`)
    .setDescription(`A művelet megszakítva!`)
    .setColor(`RED`)


export default new Command()
    .setName(`kick`)
    .setDescription(`Kirúg egy embert.`)
    .setId(`834049049471746068`)
    .addRequiredPermission(`KICK_MEMBERS`)
    .setCategory(CommandCategory.MODERATION)
    .setOnClick((ctx: CommandContext, args: string[]) => {
        const inter: ButtonInteraction = ctx.data as any

        const member = ctx.ranBy.guild.members.cache.get(inter.member.user.id)

        if (inter.member.user.id != args[2] && !member.permissionsIn(ctx.textChannel).has(`ADMINISTRATOR`)) {
            ctx.addRow(inter.message.components as any)
            ctx.replyEmbed(inter.message.embeds[0])
            return
        }
        switch (args[0]) {
            case `filter`:
                if (args[1] == `no`) {
                    ctx.replyEmbed(MASS_KICKING_CANCELED.addField(`Megszakította`, `<@${inter.member.user.id}>`))
                    return
                }
                const filter = args.slice(3).join(`_`)
                console.log(`Filter: ${filter}`);

                //Do kicking
                const members = ctx.ranBy.guild.members.cache.filter((m) => m.user.username.toLowerCase().includes(filter.toLowerCase()))

                members.forEach(async (m) => {
                    if (member.roles.highest.comparePositionTo(m.roles.highest) <= 0) return
                    const lastCase = await Kick.find().sort({ case: -1 }).limit(1).exec();

                    const caseId = lastCase.length == 0 ? 1 : (lastCase[0] as any).case + 1;

                    try {
                        if (m.user.dmChannel == undefined) await m.createDM()

                        m.user.dmChannel.send(`Ki lettél dobva innen: \`${m.guild.name}\`, mert: \`A felhasználóneve tartalmazta a(z) ${filter} szavakat.\``)
                    } catch (e) {

                    }

                    const data = new Kick({
                        case: caseId,
                        reason: `A felhasználóneve tartalmazta a(z) \`${filter}\` szavakat.`,
                        invite: `nincs megadva`,
                        hasRejoined: false,
                        moderator: ctx.ranBy.user.id,
                        member: m.user.id,
                        createdAt: `${Date.now()}`,
                        guild: m.guild.id
                    })

                    await data.save()

                    await m.kick(`Name containing \`${filter}\``)

                })

                ctx.replyEmbed(new MessageEmbed()
                    .setTitle(`Kidobás`)
                    .setColor(`#1dd1a1`)
                    .setDescription(`A kidobások elkezdődtek és hamarosan befejeződnek! <:edcheck:853584700214870017>`))
                return
        }
        ctx.replyString(`Args: ${args}`)
    })
    .executes(async function (ctx: CommandContext) {
        const desc = ctx.data.data.options[0].options[1]?.value;

        const id = ctx.data.data.options[0].options[0].value;

        const guild = bot.getGuild(ctx.data.guild_id as `${bigint}`)

        switch (ctx.data.data.options[0].name) {
            case `ember`:
                const member = bot.getGuildMember(ctx.data.guild_id as `${bigint}`, id as `${bigint}`)
                if (member == undefined) {
                    ctx.replyString(`Nincs ilyen ember!`)
                    return
                }

                if (!member.kickable) {
                    ctx.replyString(`Őt nem kickelhetem!`)
                    return
                }

                if (ctx.ranBy.roles.highest.comparePositionTo(member.roles.highest) < 0) {
                    ctx.replyString(`Őt nem kickelheted!`)
                    return
                }

                if (!member.user.dmChannel) {
                    await member.user.createDM();
                }

                const inv = await guild.channels.cache.get(ctx.data.channel_id as `${bigint}`).createInvite({
                    maxUses: 1,
                    reason: `Kick utáni csatlakozás`,
                })

                member.user.dmChannel.send({ embeds: [embed.setDescription(`Ki lettél dobva a(z) \`${guild.name}\` szerverről\nIndok: \`${desc != undefined ? desc : `Nincs indok megadva!`}\``)] })
                member.user.dmChannel.send(`Meghívó: https://discord.gg/${inv.code}`)

                const lastCase = await Kick.find().sort({ case: -1 }).limit(1).exec();

                const caseId = lastCase.length == 0 ? 1 : (lastCase[0] as any).case + 1;

                const resp = new MessageEmbed()
                    .setTitle("Felhasználó kidobva!")
                    .addField(`Eset:`, `\`\`\`#${caseId}\`\`\``)
                    .addField(`Felhasználó:`, `\`\`\`${member.user.username}#${member.user.discriminator}\`\`\``)
                    .addField(`Indok:`, `\`\`\`${desc != undefined ? desc : `Nincs indok megadva!`}\`\`\``)
                    .addField(`Moderátor:`, `\`\`\`${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}\`\`\``)
                    .setColor(`#1dd1a1`)
                    .setTimestamp(Date.now())
                    .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

                const data = new Kick({
                    case: caseId,
                    reason: desc,
                    invite: inv.code,
                    hasRejoined: false,
                    moderator: ctx.ranBy.user.id,
                    member: member.user.id,
                    createdAt: `${Date.now()}`,
                    guild: ctx.data.guild_id
                })

                data.save();

                member.kick(desc)

                ctx.replyEmbed(resp);
                return

            case `rang`:
                const members = bot.getGuild(ctx.data.guild_id as `${bigint}`).members.cache.array().filter((m) => m.roles.cache.has(ctx.data.data.options[0].options[0].value as `${bigint}`));
                ctx.replyString(members.map((u) => u.user.username).join(` `) + `\`Nincs kész\``)
                break

            case `eset`:
                const kick: any = await Kick.findOne({
                    guild: ctx.data.guild_id,
                    case: ctx.data.data.options[0].options[0].value
                }).exec();

                if (kick == null) {
                    ctx.replyEmbed(new MessageEmbed()
                        .setTitle(`Hiba!`)
                        .setColor(`RED`)
                        .setDescription(`Eset nem található`)
                        .setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                    return;
                }

                let kicked = bot.getUser(kick.member);
                if (kicked == undefined) {
                    kicked = await bot.bot.users.fetch(kick.member as `${bigint}`, {
                        cache: true
                    });
                }
                console.log(kick.createdAt);

                const mod = bot.getUser(kick.moderator);

                const caseE = new MessageEmbed()
                    .setTitle(`Eset #${kick.case}`)
                    .addField(`Kidobott ember: `, `\`\`\`${kicked?.username}#${kicked?.discriminator}\`\`\``)
                    .addField(`Moderátor: `, `\`\`\`${mod.username}#${mod.discriminator}\`\`\``)
                    .addField(`Indok: `, `\`\`\`${kick.reason}\`\`\``)
                    .addField(`Időpont:`, `\`\`\`${new Date(Number.parseInt(kick.createdAt)).toLocaleString()}\`\`\``)
                    .addField(`Visszacsatlakozott:`, `\`\`\`${kick.hasRejoined ? `Igen` : `Nem`}\`\`\``)
                    .setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                ctx.replyEmbed(caseE)
                return

            case `filter`:
                ctx.ranBy.guild.members.fetch()
                ctx.replyEmbed(SEARCHING_MEMBERS);
                const filter = ctx.data.data.options[0].options[0].value;
                const matchedCount = ctx.ranBy.guild.members.cache.filter((m) => m.user.username.toLowerCase().includes(filter.toLowerCase())).size

                const buttons = new ActionRow()

                buttons.addComponent(new ButtonComponent(`Igen`, ButtonStyle.SUCCESS).setCustomId(`ed_cmd_kick_filter_yes_${ctx.ranBy.user.id}_${filter}`))
                buttons.addComponent(new ButtonComponent(`Nem`, ButtonStyle.DANGER).setCustomId(`ed_cmd_kick_filter_no_${ctx.ranBy.user.id}_${filter}`))

                ctx.addRow(buttons)

                ctx.replyEmbed(new MessageEmbed()
                    .setTitle(`Kidobás`)
                    .setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                    .addField(`Keresett kifejezés`, `\`\`\`${filter}\`\`\``)
                    .addField(`Találatok`, `\`\`\`${matchedCount}\`\`\``)
                    .setColor(`#1dd1a1`))
                break;
        }
    })
