import { ButtonInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { ActionRow, ButtonComponent, ButtonStyle, Command, CommandContext } from "../controllers/CommandHandler";
import { bot } from "../main";
import { CommandCategory } from "../types/CommandTypes";

const db = bot.databaseHandler.client;

export type Poll = {
    id: number
    message: bigint
    guild: bigint
    channel: bigint
    creator: bigint
    yes: bigint[]
    no: bigint[]
    started: string
    end: string
    question: string
}

export default new Command()
    .setId(`851401048563515402`)
    .setName(`szavazás`)
    .setDescription(`Szavazást indít`)
    .addRequiredPermission(`MANAGE_GUILD`)
    .setCategory(CommandCategory.GENERAL)
    .setOnClick(async (ctx: CommandContext, args: string[]) => {
        const i = ctx.data as unknown as ButtonInteraction
        try {
            const { rows } = await db.query(`select * from "s-polls" where id=$1`, [args[0]])
            const poll: Poll = rows[0]
            if (args[1] == `end`) {
                if (i.member.user.id != `${poll.creator}` && !bot.getGuildMember(i.guildID, i.user.id).permissionsIn(i.channel).has(`MANAGE_GUILD`)) {
                    i.update({
                        embeds: i.message.embeds as MessageEmbed[]
                    })
                    return
                }
                await db.query(`update "s-polls" set ended=now() where id=$1`, [args[0]])
                const allVotes = poll.no.length + poll.yes.length

                const yesVotesP = Math.floor((poll.yes.length / allVotes) * 25)
                const noVotesP = Math.floor((poll.no.length / allVotes) * 25)

                let tmp1 = ``
                let tmp2 = ``

                for (let i = 0; i < yesVotesP; i++) {
                    tmp1 += `▉`
                }

                for (let i = 0; i < noVotesP; i++) {
                    tmp1 += `▁`
                    tmp2 += `▉`
                }

                for (let i = 0; i < yesVotesP; i++) {
                    tmp2 += `▁`
                }

                i.update({
                    components: [],
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`Szavazás`)
                            .setDescription(`**Kérdés:**${poll.question}`)
                            .setColor(bot.getColor(i.guild))
                            .addField(`Elindítva:`, moment(poll.started).format(`YYYY MMMM DD[.][(]dddd[)], HH:mm`))
                            .addField(`Vége:`, moment(poll.end).format(`YYYY MMMM DD[.][(]dddd[)], HH:mm`))
                            .addField(`Igen szavazatok(${poll.yes.length}):`, `\`\`\`${tmp1}\`\`\``)
                            .addField(`Nem szavazatok(${poll.no.length}):`, `\`\`\`${tmp2}\`\`\``)
                    ]
                })
                return
            }
            if (args[1] == `yes`) {
                if (poll.yes.includes(i.user.id as unknown as bigint)) {
                    i.update({
                        embeds: i.message.embeds as MessageEmbed[]
                    })
                    return
                } else {
                    if (poll.no.includes(i.user.id as unknown as bigint)) poll.no = poll.no.filter((e) => `${e}` != i.user.id)
                    poll.yes.push(i.user.id as unknown as bigint)
                }
            } else {
                if (poll.no.includes(i.user.id as unknown as bigint)) {
                    i.update({
                        embeds: i.message.embeds as MessageEmbed[]
                    })
                    return
                } else {
                    if (poll.yes.includes(i.user.id as unknown as bigint)) poll.yes = poll.yes.filter((e) => `${e}` != i.user.id)
                    poll.no.push(i.user.id as unknown as bigint)
                }
            }
            await db.query(`update "s-polls" set no=$1, yes=$2 where id=$3`, [poll.no, poll.yes, args[0]])

            const allVotes = poll.no.length + poll.yes.length

            const yesVotesP = Math.floor((poll.yes.length / allVotes) * 25)
            const noVotesP = Math.floor((poll.no.length / allVotes) * 25)

            let tmp1 = ``
            let tmp2 = ``

            for (let i = 0; i < yesVotesP; i++) {
                tmp1 += `▉`
            }

            for (let i = 0; i < noVotesP; i++) {
                tmp1 += `▁`
                tmp2 += `▉`
            }

            for (let i = 0; i < yesVotesP; i++) {
                tmp2 += `▁`
            }

            i.update({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Szavazás`)
                        .setDescription(`**Kérdés:**\n${poll.question}`)
                        .setColor(bot.getColor(i.guild))
                        .addField(`Elindítva:`, moment(poll.started).format(`YYYY MMMM DD[.][(]dddd[)], HH:mm`))
                        .addField(`Igen szavazatok(${poll.yes.length}):`, `\`\`\`${tmp1}\`\`\``)
                        .addField(`Nem szavazatok(${poll.no.length}):`, `\`\`\`${tmp2}\`\`\``)
                ]
            })
        } catch (e) {
            console.log(e)
            i.update({
                embeds: i.message.embeds as MessageEmbed[]
            })
            return
        }

    })
    .executes(async (ctx: CommandContext) => {

        try {
            const { rows } = await db.query(`insert into "s-polls" (message, guild, channel, creator, question, started) VALUES ($1,$2,$3,$4,$5,now()) returning id`, [
                0,
                ctx.data.guildID,
                ctx.data.channelID,
                ctx.data.user.id,
                ctx.data.options.array()[0].value as string
            ])

            const id = rows[0].id

            const r = new ActionRow()
            r.addComponent(new ButtonComponent(`Igen`, ButtonStyle.SUCCESS).setCustomId(`ed_cmd_szavazás_${id}_yes`).setEmoji(bot.bot.emojis.cache.get(`853584700214870017`)))
            r.addComponent(new ButtonComponent(`Nem`, ButtonStyle.DANGER).setCustomId(`ed_cmd_szavazás_${id}_no`).setEmoji(bot.bot.emojis.cache.get(`853582551323377675`)))
            r.addComponent(new ButtonComponent(`Lezár`, ButtonStyle.SECONDARY).setCustomId(`ed_cmd_szavazás_${id}_end`))

            ctx.addRow(r)
            ctx.replyEmbed(
                new MessageEmbed()
                    .setTitle(`Szavazás`)
                    .setDescription(`**Kérdés:**\n${ctx.data.options.array()[0].value as string}`)
                    .setColor(bot.getColor(ctx.data.guild))
                    .addField(`Elindítva:`, moment(Date.now()).format(`YYYY MMMM DD[.][(]dddd[)], HH:mm`))
                    .addField(`Igen szavazatok(0):`, `\`\`\`▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\`\`\``)
                    .addField(`Nem szavazatok(0):`, `\`\`\`▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\`\`\``))
        } catch (e) {
            ctx.replyString(`Hiba!`)
            console.log(e);
            return
        }
    })