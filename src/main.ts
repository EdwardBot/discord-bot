import { Message } from 'discord.js'
import { config } from 'dotenv'
import DeletableResponse from './models/DeletableResponse'

config({
    path: `./.env`
});

String.prototype['toHHMMSS'] = function () {
    let sec_num = parseInt(this, 10); 
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {(hours as any)  = "0"+hours;}
    if (minutes < 10) {(minutes as any) = "0"+minutes;}
    if (seconds < 10) {(seconds as any) = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

let delMsgs = {}

export async function mkMsgDel(msg: Message, authorId: string, canDelete?: string[]) {
    if (!msg) return
    await msg.react(`❌`);
    if (canDelete) canDelete.push(authorId);
    await new DeletableResponse({
        messageId: msg.id,
        canClose: canDelete ? canDelete : [authorId],
        createdAt: Date.now()
    }).save();
}
/*
bot.ws.on((`INTERACTION_CREATE` as any), async (d, shard) => {

    const tc = (ch as TextChannel);
    const user = (await bot.guilds.fetch(data.guild_id)).members.cache.get(data.member.user.id);
    let hasPerm = true;
    let noPerm = `ADMINISTRATOR`;
    if (user == undefined || user == null) {
        return noPermMsg(tc, data.member.user, `LÉTEZÉS`);
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

bot.on(`messageReactionAdd`, async (reaction, user) => {
    if (reaction.emoji.name == `❌`) {
        const res = await DeletableResponse.findOne({
            messageId: reaction.message.id
        });
        if (res) {
            if ((res.toObject() as any).canClose.includes(user.id)
                || reaction.message.guild.members.cache.get(user.id).hasPermission(`ADMINISTRATOR`)) {
                reaction.message.delete()
                res.deleteOne();
            } else {
                reaction.users.remove(user.id);
            }
        }
    }
})

bot.on(`guildCreate`, (guild) => {
    new GuildConfig({
        guildId: guild.id,
        joinedAt: Date.now(),
        allowLogging: false,
        allowWelcome: false,
        botAdmins: [guild.ownerID]
    }).save();
    const welcome = new MessageEmbed()
        .setTitle(`Üdvözöllek! <a:aWave:810086084343365662>`)
        .setDescription(`Köszi hogy hozzáadtál a szerveredhez!\n> Segítséget találhatsz a discord szerverünkön, vagy a dashboardunkon.\nA prefix /`)
        .setFooter(`EdwardBot`, bot.user.avatarURL())
    guild.systemChannel ? guild.systemChannel.send(welcome) : ``;
    bot.user.setPresence({
        activity: {
            name: `a parancsokat ${bot.guilds.cache.size} szerveren | /help`,
            type: `WATCHING`
        }
    })
})

bot.on(`guildDelete`, async (guild) => {
    (await GuildConfig.findOne({
        guildId: guild.id
    })).deleteOne();
    bot.user.setPresence({
        activity: {
            name: `a parancsokat ${bot.guilds.cache.size} szerveren | /help`,
            type: `WATCHING`
        }
    })
})*/

import { Bot } from "./bot";

export const bot = new Bot();

bot.load()
