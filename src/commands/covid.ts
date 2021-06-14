import { MessageEmbed } from 'discord.js';
import { CommandCategory } from '../types/CommandTypes';
import { Command, CommandContext } from '../controllers/CommandHandler';
import axios from 'axios';
import { CovidResponse } from '../types/CovidResponse';

const error = new MessageEmbed()
    .setTitle(`Hiba! <:eddenied:853582551323377675>`)
    .setDescription(`Nem sikerült lekérni az adatokat!`)
    .setColor(`RED`)

const cmd = new Command()
    .setName(`covid`)
    .setDescription(`Koronavírus adatok magyarországon.`)
    .setId(`831226459691024447`)
    .setCategory(CommandCategory.INFO)
    .executes(async function(ctx: CommandContext) {
        ctx.setLoading();

        const { data, status } = await axios.get(`https://data.edwardbot.tk/covid`)
        if (status != 200) {
            ctx.replyEmbed(error)
            return
        }
        
        const d = data as CovidResponse
        const embed = new MessageEmbed()
            .setTitle(`Koronavírus adatok`)
            .setThumbnail(`https://www.fda.gov/files/Coronavirus_3D_illustration_by_CDC_1600x900.png`)
            .setURL(`https://koronavirus.gov.hu`)
            .addField(`Aktív fertőzöttek:`, `​​​ ​`)
            .addField(`Pest`, d.infected.capital, true)
            .addField(`Vidék`, d.infected.countryside, true)
            .addField(`Összesen`, d.infected.capital + d.infected.countryside, true)
            .addField(`Gyógyultak:`, `​​​​​​​ ​​​`)
            .addField(`Pest`, d.recovered.capital, true)
            .addField(`Vidék`, d.recovered.countryside, true)
            .addField(`Összesen`, d.recovered.capital + d.recovered.countryside, true)
            .addField(`**Elhunytak**:`, `​ ​​​`)
            .addField(`Pest`, d.died.capital, true)
            .addField(`Vidék`, d.died.countryside, true)
            .addField(`Összesen`, d.died.capital + d.died.countryside, true)
            .addField(`**Átesettek**:`, `​ ​​​`)
            .addField(`Pest`, d.died.capital + d.recovered.capital, true)
            .addField(`Vidék`, d.died.countryside + d.recovered.countryside, true)
            .addField(`Összesen`, d.died.capital + d.died.countryside + d.recovered.capital + d.recovered.countryside, true)
            .addField(`Beoltottak`, d.vaccinated, true)
            .addField(`Karanténban`, d.quarantine, true)
            .addField(`Mintavételek`, d.sampled, true)
            .setTimestamp(Date.now())
            .setColor(`#00d2d3`)

        ctx.replyEmbed(embed);
    })

export default cmd;
