import { MessageEmbed } from "discord.js";
import { Command, CommandContext } from "../controllers/CommandHandler";
import { bot } from "../main";
import Wallet from "../models/Wallet";
import { CommandCategory } from "../types/CommandTypes";

const NO_PERM_EMBED = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Nincs jogod ehhez!\nHiányzik a Szerver kezelése jogosúltságod, vagy a kiválasztott ember rangja magasabb!`)

const NO_BOTS_ALLOWED = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Botoknak nem lehet pénze! :pensive:`)


export default new Command()
    .setName(`pénz`)
    .setDescription(`Pénzel kapcsolatos dolgok`)
    .setId(`843903448817598515`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading()
        switch (ctx.data.data.options[0].name) {
            case "set":
                const member = bot.getGuildMember(ctx.data.guild_id as `${bigint}`, ctx.data.data.options[0].options[0].value as `${bigint}`)

                if (!ctx.ranBy.permissionsIn(ctx.textChannel).has(`MANAGE_GUILD`) || member.roles.highest.comparePositionTo(ctx.ranBy.roles.highest) > 0) {
                    ctx.replyEmbed(NO_PERM_EMBED.setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                    return
                }

                if (member.user.bot) {
                    ctx.replyEmbed(NO_BOTS_ALLOWED.setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                    return
                }

                const val = Number.parseInt(ctx.data.data.options[0].options[1].value)
                const w: any = await Wallet.findOne({
                    guildId: ctx.data.guild_id,
                    userId: member.id
                })

                w.balance = val;
                w.save();

                ctx.replyString(`${member.user.username}#${member.user.discriminator} egyenlege beállítva erre: ${val}$`)
                return
            
            default:
            case `egyenleg`:
                if (ctx.data.data.options[0].options != undefined) {
                    const user = bot.getUser(ctx.data.data.options[0].options[0].value as `${bigint}`)
                    const wallet: any = await Wallet.findOne({
                        guildId: ctx.data.guild_id,
                        userId: ctx.data.data.options[0].options[0].value
                    })
                    ctx.replyString(`${user.username}#${user.discriminator} egyenlege: ${wallet.balance}$`)
                    return
                }
                const wallet: any = await Wallet.findOne({
                    guildId: ctx.data.guild_id,
                    userId: ctx.ranBy.user.id
                })
                ctx.replyString(`Egyenleged: ${wallet.balance}$`)
                
                return
        }
    });