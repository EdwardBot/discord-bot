import { Client, Message, MessageEmbed, TextChannel } from "discord.js"
import { CommandResponse } from './types/CommandResponse'
import { connect } from 'mongoose'
import ping from './commands/ping'
import help from './commands/help'
import setactivity from './commands/setactivity'
import stop from './commands/stop'
import meme from './commands/meme'
import purge from './commands/purge'
import calc from './commands/calc'
import stats from './commands/stats'
import serverInfo from './commands/server-info'
import kick from './commands/kick'
import mcserver from './commands/mcserver'
import coinflip from './commands/coinflip'
import howgay from './commands/howgay'
import covid from './commands/covid'
import { noPermMsg } from "./utils"
import { config } from 'dotenv'
import Config from "./models/Config"
import axios from "axios"
import DeletableResponse from "./models/DeletableResponse"
import { electronMassDependencies } from "mathjs"

config({
    path: './.env'
});

const bot = new Client({
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER']
})

let delMsgs = {}

export let commandsRun = 0

async function connectDB() {
    console.log(`Connecting to the db.`)
    connect('mongodb://localhost:27017/edward', {
        appname: 'EdwardBot',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) {
            console.log('Db connection lost, reconnecting!');
            const embed = new MessageEmbed()
                .setTitle('Debug')
                .setColor('RED')
                .setDescription(`Db connection lost, reconnecting!${err ? `\nError: ${err.message}` : ``}`);
            (bot.channels.cache.get('809097196267372555') as TextChannel).send(embed);
            setTimeout(() => connectDB(), 1000);
        } else {
            console.log(`Connected to the db.`);
            initCommandsRun();
            cleanDb();
        }
    });
}

async function initCommandsRun() {
    let ran = await Config.findOne({
        key: `stats.commands_run`
    });
    if (ran == null || ran == undefined) {
        const asd = new Config({
            key: `stats.commands_run`,
            value: `100`
        })
        ran = await asd.save();
    }
    commandsRun = Number.parseInt((ran.toObject() as any).value)

    setInterval(async () => {
        const obj = await Config.findOne({
            key: `stats.commands_run`
        });
        await obj.updateOne({
            key: `stats.commands_run`,
            value: `${commandsRun}`
        })
    }, 20000)
}

async function cleanDb() {
    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-1);
    DeletableResponse.find({createdAt: {$lte: cutoff.getTime()}}, function (err, docs) { 
        if (err) console.log(err);
        DeletableResponse.deleteMany(docs); 
    })
}

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

export async function mkMsgDel(msg: Message, authorId: string, canDelete?: string[]) {
    await msg.react('❌');
    if (canDelete) canDelete.push(authorId);
    await new DeletableResponse({
        messageId: msg.id,
        canClose: canDelete ? canDelete : [authorId],
        createdAt: Date.now()
    }).save();
}

bot.ws.on(('INTERACTION_CREATE' as any), async (d, shard) => {
    const data = (d as CommandResponse);
    if (data.type == 1) {
        (bot as any).api.interactions(d.id, data.token).callback.post({
            data: {
                type: 1
            }
        })
        return;
    }
    const ch = bot.channels.cache.get(data.channel_id);

    await (bot as any).api.interactions(d.id, data.token).callback.post({
        data: {
            type: 5
        }
    });

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
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name == '❌') {
        const res = await DeletableResponse.findOne({
            messageId: reaction.message.id
        });
        if (res) {
            if ((res.toObject() as any).canClose.includes(user.id)
                || reaction.message.guild.members.cache.get(user.id).hasPermission('ADMINISTRATOR')) {
                reaction.message.delete()
                res.deleteOne();
            } else {
                reaction.users.remove(user.id);
            }
        }
    }
})

bot.on('rateLimit', (rate) => {
    console.log(`😒 a dc nem szeret. ${rate.limit} másodpercre letiltotta a ${rate.route}-ot!`)
})

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`)
    bot.user.setPresence({
        activity: {
            name: `a parancsokat ${bot.guilds.cache.size} szerveren | /help`,
            type: 'WATCHING'
        }
    })
    connectDB();
})

bot.login(process.env.TOKEN)