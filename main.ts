import { Client, Message, TextChannel } from "discord.js";
import { CommandResponse } from './types/CommandResponse';
import ping from './commands/ping';
import help from './commands/help';
import setactivity from './commands/setactivity';
import stop from './commands/stop';
import meme from './commands/meme';
import purge from './commands/purge';
import calc from './commands/calc';
import stats from './commands/stats';
import serverInfo from './commands/server-info';
import kick from './commands/kick';
import mcserver from './commands/mcserver';
import coinflip from './commands/coinflip';
import howgay from './commands/howgay';
import covid from './commands/covid';
import { readFile, writeFile } from 'fs/promises';
import { noPermMsg } from "./utils";
import { config } from 'dotenv';

config({
    path: './.env'
});

const bot = new Client({
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
})

let delMsgs = {};

export let commandsRun = 0;

console.log('loading commands');

readFile('./commands_run', {
    encoding: 'utf-8'
}).then((file) => {
    try {
        commandsRun = Number.parseInt(file);
    } catch (e) { }
})

setInterval(() => {
    writeFile('./commands_run', commandsRun + '')
}, 20000);


export const commands = [
    ping,
    help,
    setactivity,
    stop,
    meme,
    purge,
    calc,
    stats,
    kick,
    serverInfo,
    mcserver,
    coinflip,
    howgay,
    covid
]

export async function mkMsgDel(msg: Message, authorId: string, timeout: NodeJS.Timeout) {
    await msg.react('❌');
    delMsgs[msg.id] = {
        author: authorId,
        timeout: timeout
    };
}

bot.ws.on(('INTERACTION_CREATE' as any), (d, shard) => {
    const data = (d as CommandResponse);
    bot.channels.fetch(data.channel_id).then(async (ch) => {
        if (ch.isText()) {
            const tc = (ch as TextChannel);
            const user = (await bot.guilds.fetch(data.guild_id)).members.cache.get(data.member.user.id);
            const cmd = commands.find((cmd) => cmd.id == data.data.id);
            let hasPerm = true;
            let noPerm = 'ADMINISTRATOR';
            if (user == undefined || user == null) {
                return noPermMsg(tc, data.member.user, 'LÉTEZÉS');
            }
            cmd.requiedPermissions.forEach((perm) => {
                if (user == undefined || user == null) {
                    hasPerm = false;
                } else if (!user.hasPermission(perm)) {
                    hasPerm = false;
                    noPerm = perm;
                }
            })
            if (hasPerm) cmd.run(bot, tc, data);
            else noPermMsg(tc, data.member.user, noPerm)
            commandsRun++;
        }
    })
});

bot.on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.name == '❌') {
        if (delMsgs[reaction.message.id] == undefined) return;
        if (user.id == delMsgs[reaction.message.id].author) {
            reaction.message.delete()
            if (delMsgs[reaction.message.id].timeout) clearTimeout(delMsgs[reaction.message.id].timeout)
            delMsgs[reaction.message.id] = undefined;
        } else if (delMsgs[reaction.message.id] != undefined) {
            //reaction.remove()
        }
    }
})

bot.on('rateLimit', (rate) => {
    console.log(`😒 a dc nem szeret. ${rate.limit} másodpercre letiltotta a ${rate.route}-ot!`)
})

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`)
    bot.user.setPresence({
        activity: {
            name: `a parancsokat ${bot.guilds.cache.size} szerveren | /help`,
            type: 'WATCHING'
        }
    })
})

bot.login(process.env.TOKEN)