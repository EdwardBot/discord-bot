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

*/

import { Bot } from "./bot";

export const bot = new Bot();

bot.load()
