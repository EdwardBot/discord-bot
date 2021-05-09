import { MessageEmbed } from 'discord.js';
import { CommandCategory } from '../types/CommandTypes';
import { Command, CommandContext } from '../controllers/CommandHandler';
import covid from '../controllers/CovidConstroller';

const cmd = new Command()
    .setName(`covid`)
    .setDescription(`Koronavírus adatok magyarországon.`)
    .setId(`831226459691024447`)
    .setCategory(CommandCategory.INFO)
    .executes(async function(ctx: CommandContext) {
        ctx.setLoading();

        const cData = covid.getData();
        const embed = new MessageEmbed()
            .setDescription(``)
            .setThumbnail(`https://www.fda.gov/files/Coronavirus_3D_illustration_by_CDC_1600x900.png`)
            .setURL(cData.sourceUrl)
            .addField(`Aktív fertőzöttek:`, cData.activeInfected, true)
            .addField(`Összes fertőzött:`, cData.infected, true)
            .addField(`Elhunytak:`, cData.deceased, true)
            .addField(`Karanténban:`, cData.quarantined, true)
            .addField(`Teszteltek:`, cData.tested, true)
            .addField(`Gyógyultak:`, cData.recovered, true)
            .setTimestamp(Date.now())
            .setColor(`#00d2d3`)

        ctx.replyEmbed(embed);
    })

export default cmd;
