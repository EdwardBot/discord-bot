import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import axios from 'axios';
import { CovidResponse } from '../types/CovidResponse';
import { CommandCategory } from '../types/CommandTypes';

export default {
    name: `covid`,
    description: `Koronavírus adatok magyarországon.`,
    id: `810112606954192897`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.INFO,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Koronavírus adatok")
            .setDescription(`Lekérés...`)
            .setColor(`RANDOM`)
            .setTimestamp(Date.now())
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const msg = await tc.send(embed)
        const resp = await axios.get(`https://api.apify.com/v2/key-value-stores/RGEUeKe60NjU16Edo/records/LATEST?disableRedirect=true`, {
            method: `GET`
        });
        const cData = (resp.data as CovidResponse);
        embed.setDescription(``)
            .setThumbnail(`https://www.fda.gov/files/Coronavirus_3D_illustration_by_CDC_1600x900.png`)
            .setURL(cData.sourceUrl)
            .addField(`Aktív fertőzöttek:`, cData.activeInfected, true)
            .addField(`Összes fertőzött:`, cData.infected, true)
            .addField(`Elhunytak:`, cData.deceased, true)
            .addField(`Karanténban:`, cData.quarantined, true)
            .addField(`Teszteltek:`, cData.tested, true)
            .addField(`Gyógyultak:`, cData.recovered, true)
            .setColor(`#00d2d3`)

        msg.edit(embed);
    }
}