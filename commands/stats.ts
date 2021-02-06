import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { version } from 'os';
import { commandsRun, mkMsgDel } from '../main';

export default {
    name: 'infó',
    description: 'A bot statisztikái.',
    id: '807548232292630548',
    requiesOwner: false,
    requiedPermissions: [],
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const stats = new MessageEmbed()
            .setTitle("Statisztikák")
            .addField("A bot pingje:", `${bot.ws.ping}ms`)
            .addField(`Futtató oprendszer típusa:`, `${process.arch}`)
            .addField(`NodeJS verzió:`, process.version)
            .addField(`Futtató operációs rendszer:`, version())
            .addField(`Memória használat:`, `${(process.memoryUsage().heapUsed/1024/1024).toFixed(3)}Mb`)
            .addField(`Futásidő:`, process.uptime()/60 > 60 ? (process.uptime()/60/60).toFixed(3) + 'óra' : (process.uptime()/60).toFixed(3) + 'perc')
            .addField(`Ennyi szerveren van bent a bot:`, bot.guilds.cache.size)
            .addField(`Parancsok lefuttatva a kezdetektől:`, commandsRun)
            .setTimestamp(Date.now())
            .setColor('#feca57')
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const msg = await tc.send(stats);
        mkMsgDel(msg, data.member.user.id, null);
    }
}