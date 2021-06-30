import { config } from 'dotenv'

config({
    path: `./.env`
});


//Code stolen from stackoverflow (btw I don't used to do that)
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

process.on(`uncaughtException`, console.error)
process.on(`unhandledRejection`, console.error)

import { Bot } from "./bot";

export const bot = new Bot();

bot.load()
