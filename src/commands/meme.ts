import { MessageEmbed } from 'discord.js'
import { CommandCategory } from '../types/CommandTypes'
import { Command, CommandContext } from '../controllers/CommandHandler'
import { MemeController } from '../controllers/MemeController'
import { bot } from '../main'


export default new Command()
    .setName(`meme`)
    .setDescription(`Küld egy random mémet.`)
    .setId(`816260709084168213`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading()
        const meme = MemeController.getRandom()
        const embed = new MessageEmbed()
            .setTitle("Meme")
            .setTimestamp(Date.now())
            .setColor(`RANDOM`)
            .setAuthor("EdwardBot", bot.bot.user.avatarURL())
            .setImage(meme.url)
            .setURL(meme.permalink)
            .setTitle(meme.title)
            .setFooter(`Lefuttatta: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`);

        ctx.replyEmbed(embed);
    })
