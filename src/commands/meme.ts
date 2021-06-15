import { MessageEmbed } from 'discord.js'
import { CommandCategory } from '../types/CommandTypes'
import { Command, CommandContext } from '../controllers/CommandHandler'
import { bot } from '../main'
import axios from 'axios'

export default new Command()
    .setName(`meme`)
    .setDescription(`Küld egy random mémet.`)
    .setId(`816260709084168213`)
    .setCategory(CommandCategory.FUN)
    .executes(async (ctx: CommandContext) => {
        ctx.setLoading()
        const { data } = await axios.get(`https://data.edwardbot.tk/meme/random`)
        
        const embed = new MessageEmbed()
            .setTitle("Meme")
            .setTimestamp(Date.now())
            .setColor(`RANDOM`)
            .setAuthor("EdwardBot", bot.bot.user.avatarURL())
            .setImage(data.image)
            .setURL(data.url)
            .setTitle(data.title)
            .setFooter(`Készítette: u/${data.author}`);

        ctx.replyEmbed(embed);
    })
