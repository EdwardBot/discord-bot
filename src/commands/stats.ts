import { MessageEmbed } from 'discord.js';
import { version } from 'os';
import { bot, mkMsgDel } from '../main';
import { CommandCategory } from '../types/CommandTypes';
import { commandsRun } from '../controllers/DatabaseHandler';
import { Command, CommandContext } from '../controllers/CommandHandler';

export default new Command()
    .setName(`infó`)
    .setDescription(`Alapvető információk a botról, szerverről vagy felhasználóról.`)
    .setId(`807649457474240522`)
    .setCategory(CommandCategory.INFO)
    .executes(async (ctx: CommandContext) => {
        const sub = ctx.data.data.options[0].name;


        const embed = new MessageEmbed()
            .setTitle(`Információk`)
            .setFooter(`Lefuttata: ${ctx.ranBy.user.username}#${ctx.ranBy.user.discriminator}`)
            .setTimestamp(Date.now())
            .setColor(`#feca57`);


        switch (sub) {
            case `bot`:
                embed.addField("A bot pingje:", `${bot.getPing()}ms`, true)
                    .addField(`Futtató oprendszer:`, `${process.platform}`, true)
                    .addField(`NodeJS verzió:`, process.version, true)
                    .addField(`Memória használat:`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}Mb`, true)
                    .addField(`Futásidő:`, (process.uptime().toString() as any).toHHMMSS(), true)
                    .addField(`Ennyi szerveren van bent a bot:`, bot.bot.guilds.cache.size, true)
                    .addField(`Parancsok lefuttatva a kezdetektől:`, commandsRun, true)
                break;

            case `szerver`:
                const guild = bot.bot.guilds.cache.get(ctx.data.guild_id);

                embed.addField(`A szerver neve:`, guild.name, true)
                    .addField(`Tulajdonos:`, `${guild.owner.user.username}#${guild.owner.user.discriminator}`, true)
                    .addField(`Szerver ID:`, guild.id, true)
                    .addField(`Tagok (összes):`, guild.members.cache.size, true)
                    .addField(`Tagok (nem bot):`, guild.members.cache.filter((u) => !u.user.bot).size, true)
                    .addField(`Tagok (bot):`, guild.members.cache.filter((u) => u.user.bot).size, true)
                    .addField(`Rangok:`, guild.roles.cache.size, true)
                    .addField(`Emojik:`, guild.emojis.cache.size, true)
                    .addField(`Szerver régiója:`, guild.region, true)
                    .addField(`Csatornák:`, guild.channels.cache.size, true)
                    .addField(`Szöveges csatornák:`, guild.channels.cache.filter((ch) => ch.isText()).size, true)
                    .addField(`Hang csatornák:`, guild.channels.cache.filter((ch) => !ch.isText()).size, true)
                    .addField(`Rangok:`, guild.roles.cache.array().map((r) => `<@&${r.id}>`).join(` `))
                    .setThumbnail(guild.iconURL());

                    if (ctx.ranBy.hasPermission(`MANAGE_GUILD`)) {
                        embed.setURL(`https://dashboard.edwardbot.tk/g/${guild.id}?ref=srvinf&user=${ctx.ranBy.user.id}`)
                    }
                break;

            case `felhasználó`:
                const user = ctx.ranBy;
                embed.addField(`Felhasználónév:`, user.user.username, true)
                    .addField(`Azonosító:`, user.user.discriminator, true)
                    .addField(`ID: `, user.user.id, true)
                    .setThumbnail(user.user.avatarURL())
                    .addField(`Regisztrált: `, new Date(user.user.createdTimestamp).toUTCString(), true)
                    .addField(`Csatlakozott a szerverhez:`, user.joinedAt.toUTCString(), true)
                    .addField(`Beceneve:`, user.nickname ? user.nickname : `Nincs`, true)
                    .addField(`Rangjai: `, user.roles.cache.array().map((r) => r.name == `@everyone` ? r.name : `<@&${r.id}>`).join(` `))
                break;
        }
        ctx.replyEmbed(embed)

        mkMsgDel(ctx.response.reply, ctx.ranBy.user.id)
    })
