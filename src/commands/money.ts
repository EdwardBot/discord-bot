import { GuildMember, MessageEmbed } from "discord.js";
import { Command, CommandContext } from "../controllers/CommandHandler";
import { bot } from "../main";
import { CommandCategory } from "../types/CommandTypes";

const NO_PERM_EMBED = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Nincs jogod ehhez!\nHiányzik a Szerver kezelése jogosúltságod, vagy a kiválasztott ember rangja magasabb!`)

const NO_BOTS_ALLOWED = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Botoknak nem lehet pénze! :pensive:`)

const db = bot.databaseHandler.client;

export default new Command()
    .setName(`pénz`)
    .setDescription(`Pénzel kapcsolatos dolgok`)
    .setId(`843903448817598515`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        const args = ctx.data.options.array()
        ctx.setLoading()
        switch (args[0].name) {
            case "set":
                const member = ctx.data.member as GuildMember

                if (!ctx.ranBy.permissionsIn(ctx.textChannel).has(`MANAGE_GUILD`) || member.roles.highest.comparePositionTo(ctx.ranBy.roles.highest) > 0) {
                    ctx.replyEmbed(NO_PERM_EMBED.setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                    return
                }

                if (member.user.bot) {
                    ctx.replyEmbed(NO_BOTS_ALLOWED.setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                    return
                }

                const val = args[0].options.array()[1].value as number

                try {
                    await db.query(`UPDATE wallets SET balance=$1 WHERE guild=$2 AND userid=$3`, [
                        val,
                        ctx.data.guildID,
                        ctx.data.user.id
                    ]);
                    ctx.replyString(`${member.user.username}#${member.user.discriminator} egyenlege beállítva erre: ${val}$`)
                } catch (e) {
                    console.log(e);
                    ctx.replyString(`Hiba történt!`)
                }
                return

            default:
            case `egyenleg`:
                const user = args[0].options != undefined ? args[0].options.array()[0].user : ctx.data.user
                try {
                    const { rows } = await db.query(`SELECT * FROM wallets WHERE guild=$1 AND userid=$2`, [
                        ctx.data.guildID,
                        user.id
                    ])
                    ctx.replyString(`${user.username}#${user.discriminator} egyenlege: ${rows[0].balance}$`)
                } catch (e) {
                    ctx.replyString(`Hiba történt!`)
                }
                return
        }
    });