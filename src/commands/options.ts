import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandContext } from "../controllers/CommandHandler";
import { bot } from "../main";
import { CommandCategory } from "../types/CommandTypes";


const ERROR_NOT_TEXT = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Nem szöveges csatornát adtál meg!`);

const db = bot.databaseHandler.client

export default new Command()
    .setName(`beállítások`)
    .setCategory(CommandCategory.GENERAL)
    .setId(`841705670775406632`)
    .addRequiredPermission(`MANAGE_GUILD`)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading();
        const category = ctx.data.options.array()[0];

        let gConf;

        try {
            const { rows } = await db.query(`SELECT * FROM "guild-configs" WHERE "GuildId"=$1`, [ctx.data.guildID])
            gConf = rows[0]
        } catch (e) {
            ctx.replyString(`Hiba!`)
            return
        }

        switch (category.name) {
            case `csatorna`:
                const channelType = category.options.array()[0].value as string;
                if (category.options.array()[1] == undefined) {
                    const chanType = chanTypeConv[channelType]

                    const embed = new MessageEmbed()
                        .setTitle(`Beállítások`)
                        .setColor(`GREEN`)
                        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                        .setDescription(gConf[`${chanType.dbId}Channel`] == 0 ? `Nincs Üdvözlő csatorna megadva!`
                            : `${chanType.locName} csatorna: <#${gConf[`${chanType.dbId}Channel`]}>`)

                    ctx.replyEmbed(embed)
                } else {
                    const channel = category.options.array()[1].channel as TextChannel;
                    if (!channel.isText()) {
                        ctx.replyEmbed(ERROR_NOT_TEXT
                            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`), true)
                        return
                    }

                    const embed = new MessageEmbed()
                        .setTitle("Beállítások")
                        .setColor("GREEN")
                        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                        .setDescription(`${chanTypeConv[channelType].locName} csatorna beállítva erre: <#${channel}>!`)

                    gConf[`${chanTypeConv[channelType].dbId}Channel`] = channel.id
                    try {
                        await db.query(`UPDATE "guild-configs" SET "${chanTypeConv[channelType].dbId}Channel"=$1 WHERE "GuildId"=$2`, [
                            channel.id,
                            channel.guild.id
                        ])
                    } catch (e) {
                        ctx.replyString(`Hiba!`)
                        return
                    }

                    ctx.replyEmbed(embed)
                }
                break;

            case `funkciók`:
                const args = category.options.array()
                const type = chanTypeConv[args[0].value as string]
                const state = args[1].value as boolean
                let data;
                try {
                    const { rows } = await db.query(`SELECT * FROM "guild-configs" WHERE "GuildId"=$1`, [ctx.data.guildID])
                    data = rows[0];
                } catch (e) {
                    ctx.replyString(`Hiba!`)
                    return
                }
                let num = state ? data.AllowedFeatures | 1 << type.bit : data.AllowedFeatures ^ 1 << type.bit;

                try {
                    await db.query(`UPDATE "guild-configs" SET "AllowedFeatures"=$1 WHERE "GuildId"=$2`, [
                        num,
                        ctx.data.guildID
                    ])
                } catch (e) {
                    ctx.replyString(`Hiba!`)
                    return
                }
                ctx.replyString(`${type.locName} Csatorna ${state ? `bekapcsolva` : `kikapcsolva`}!`)
                break


            default:
                ctx.sendError()
                return
        }
    })

const chanTypeConv = {
    welcome: {
        dbId: `Join`,
        locName: `Üdvözlő`,
        bit: 1
    },
    leave: {
        dbId: `Leave`,
        locName: `Távozó`,
        bit: 0
    },
    log: {
        dbId: `Log`,
        locName: `Napló`,
        bit: 2
    }
}