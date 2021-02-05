import { Client, Message, TextChannel } from "discord.js";
import { CommandResponse } from './types/CommandResponse';
import * as config from './botconfig.json';
import * as ping from './commands/ping';
import * as help from './commands/help';
import * as setactivity from './commands/setactivity';
import * as stop from './commands/stop';
import * as meme from './commands/meme';
import * as purge from './commands/purge';

const bot = new Client({
    partials: [ 'MESSAGE', 'REACTION', 'GUILD_MEMBER' ]
})

let delMsgs = {};

export const commands = [
    ping,
    help,
    setactivity,
    stop,
    meme,
    purge
]

export async function mkMsgDel(msg: Message, authorId: string, timeout: NodeJS.Timeout) {
    await msg.react('❌');
    delMsgs[msg.id] = {
        author: authorId,
        timeout: timeout
    };
}

bot.ws.on(('INTERACTION_CREATE'as any), (d,shard) => {
    const data = (d as CommandResponse);
    bot.channels.fetch(data.channel_id).then(async (ch) => {
        if (ch.isText()) {
            const tc = (ch as TextChannel);
            commands.find((cmd) => cmd.default.id == data.data.id).default.run(bot, tc, data);
        }
    })
});

bot.on('messageReactionAdd', (reaction, user) => {
    console.log(user.username);
    if (reaction.emoji.name == '❌') {
        if (delMsgs[reaction.message.id] == undefined) return;
        if (user.id == delMsgs[reaction.message.id].author) {
            reaction.message.delete()
            clearTimeout(delMsgs[reaction.message.id].timeout)
            delMsgs[reaction.message.id] = undefined;
        } else if (delMsgs[reaction.message.id] != undefined) {
            reaction.remove()
        }
    }
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

bot.login(config.token)