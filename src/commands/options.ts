import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandContext } from "../controllers/CommandHandler";
import { bot } from "../main";
import GuildConfig from "../models/GuildConfig";
import { CommandCategory } from "../types/CommandTypes";


const ERROR_NOT_TEXT = new MessageEmbed()
    .setTitle(`Hiba`)
    .setColor(`RED`)
    .setDescription(`Nem szöveges csatornát adtál meg!`)

export default new Command()
    .setName(`beállítások`)
    .setCategory(CommandCategory.GENERAL)
    .setId(`841705670775406632`)
    .addRequiredPermission(`MANAGE_GUILD`)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading();
        const category = ctx.data.data.options[0];

        const gConf: any = await GuildConfig.findOne({
            guildId: ctx.data.guild_id
        })

        switch (category.name) {
            case `csatorna`:
                const channelType = category.options[0].value;
                if (category.options[1] == undefined) {
                    //Get option

                    const chanType = chanTypeConv[channelType]
                    
                    const embed = new MessageEmbed()
                        .setTitle(`Beállítások`)
                        .setColor(`GREEN`)
                        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                        .setDescription(gConf[`${chanType.dbId}Channel`] == undefined ? `Nincs Üdvözlő csatorna megadva!`
                                : `${chanType.locName} csatorna: <#${gConf[`${chanType.dbId}Channel`].id}>`)

                    ctx.replyEmbed(embed)
                } else {
                    const channel = bot.getChannel(category.options[1].value as `${bigint}`) as TextChannel;
                    if (!channel.isText()) {
                        ctx.replyEmbed(ERROR_NOT_TEXT
                            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`), true)
                        return
                    }

                    const embed = new MessageEmbed()
                        .setTitle("Beállítások")
                        .setColor("GREEN")
                        .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
                        .setDescription(`${chanTypeConv[channelType].locName} csatorna beállítva erre: <#${channel.id}>!`)

                    gConf[`${chanTypeConv[channelType].dbId}Channel`] = {
                        id: channel.id,
                        name: channel.name
                    }

                    gConf.save()

                    ctx.replyEmbed(embed)
                }
                break;

            default:
                ctx.sendError()
                return
        }
    })

const chanTypeConv = {
    welcome: {
        dbId: `join`,
        locName: `Üdvözlő`
    },
    leave: {
        dbId: `leave`,
        locName: `Távozó`
    },
    log: {
        dbId: `log`,
        locName: `Napló`
    }
}