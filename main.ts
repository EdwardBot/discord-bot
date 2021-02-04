import { Client, TextChannel, MessageEmbed, ActivityType } from "discord.js";
import { CommandResponse } from './types/CommandResponse';
import * as config from './botconfig.json';
import * as ping from './commands/ping';
import * as help from './commands/help';
import * as setactivity from './commands/setactivity';

const bot = new Client({})

export const commands = [
    ping,
    help,
    setactivity
]

bot.ws.on(('INTERACTION_CREATE'as any), (d,shard) => {
    const data = (d as CommandResponse);
    bot.channels.fetch(data.channel_id).then(async (ch) => {
        if (ch.isText()) {
            const tc = (ch as TextChannel);
            commands.find((cmd) => cmd.default.id == data.data.id).default.run(bot, tc, data);
        }
    })
});

bot.on('debug', (e) => {
    console.log(e);
})

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`)
    bot.user.setActivity("fun")
})

bot.login(config.token)