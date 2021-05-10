import { MessageEmbed } from 'discord.js';
import { Command, CommandContext } from '../controllers/CommandHandler';
import { bot } from '../main';
import Kick from '../models/Kick';
import { CommandCategory } from '../types/CommandTypes';

const embed = new MessageEmbed()
    .setTitle(`Ki lettél dobva!`)
    .setColor(`RED`);

export default new Command()
    .setName(`kick`)
    .setDescription(`Kirúg egy embert.`)
    .setId(`834049049471746068`)
    .addRequiredPermission(`KICK_MEMBERS`)
    .setCategory(CommandCategory.MODERATION)
    .executes(async function (ctx: CommandContext) {
        const desc = ctx.data.data.options[0].options[1]?.value;

        const id = ctx.data.data.options[0].options[0].value;

        const guild = bot.getGuild(ctx.data.guild_id)

        switch (ctx.data.data.options[0].name) {
            case `ember`:
                const member = bot.getGuildMember(ctx.data.guild_id, id)
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

                const inv = await guild.channels.cache.get(ctx.data.channel_id).createInvite({
                    maxUses: 1,
                    reason: `Kick utáni csatlakozás`,
                })

                member.user.dmChannel.send(embed.setDescription(`Ki lettél dobva a(z) \`${guild.name}\` szerverről\nIndok: \`${desc != undefined ? desc : `Nincs indok megadva!`}\``))
                member.user.dmChannel.send(`Meghívó: https://discord.gg/${inv.code}`)

                const lastCase = await Kick.find().sort({case: -1}).limit(1).exec();

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
                const members = bot.getGuild(ctx.data.guild_id).members.cache.array().filter((m) => m.roles.cache.has(ctx.data.data.options[0].options[0].value));
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
                    kicked = await bot.bot.users.fetch(kick.member + ``, true);
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
        }
    })
