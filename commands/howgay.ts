import { Client, TextChannel, MessageEmbed } from 'discord.js'
import { CommandResponse } from '../types/CommandResponse'
import * as config from '../botconfig.json'
import { CommandCategory } from '../types/CommandTypes';

export default {
    name: `hőmérő`,
    description: `Mennyire meleg az adott ember?`,
    id: `808013905149296660`,
    requiesOwner: false,
    requiedPermissions: [],
    category: CommandCategory.FUN,
    run: function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const val = data.data.options ? data.data.options[0].value : data.member.user.id;

        let gay = Math.round(Math.random()*100);
        if (val == config.owner_id) gay = Math.floor(gay/4);
        if (val == data.member.user.id) gay = Math.floor(gay/2);

        const embed = new MessageEmbed()
            .setTitle("Hőmérő")
            .setDescription(`<@${val}> ${gay}% hogy meleg.`)
            .setTimestamp(Date.now())
            .setColor(gay > 50 ? `#ff9ff3` : `#1dd1a1`)
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        tc.send(embed)
    }
}