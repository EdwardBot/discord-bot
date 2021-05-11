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
                    switch (channelType) {
                        case `welcome`:
                            ctx.replyEmbed(new MessageEmbed()
                                .setTitle(`Beállítások`)
                                .setColor(`GREEN`)
                                .setDescription(gConf.joinChannel == undefined ? `Nincs Üdvözlőcsatorna megadva!` 
                                : `Üdvözlőcsatorna: <#${bot.getChannel(gConf.joinChannel).id}>`)
                                .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                            return
                    }
                } else {
                    switch (channelType) {
                        case `welcome`:
                            const channel = bot.getChannel(category.options[1].value) as TextChannel;
                            if (!channel.isText()) {
                                ctx.replyEmbed(ERROR_NOT_TEXT
                                    .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`), true)
                                return
                            }
                            gConf.joinChannel = category.options[1].value + ``
                            ctx.replyEmbed(new MessageEmbed()
                                .setTitle("Beállítások")
                                .setColor("GREEN")
                                .setDescription(`Üdvözlőcsatorna beállítva erre: <#${channel.id}>`)
                                .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`))
                            break
                    }
                    gConf.save()
                }
                break;

            default:
                ctx.sendError()
                return
        }
    })