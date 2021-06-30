import { MessageEmbed } from "discord.js";
import { ActionRow, ButtonComponent, ButtonStyle, Command, CommandContext } from "../controllers/CommandHandler";
import { ButtonInteraction } from "../types/CommandTypes";

const games = {}

export default new Command()
    .setId(`851359530046324756`)
    .setName(`amőba`)
    .setDescription(`Elindít egy amőba játékot`)
    .setOnClick((ctx: CommandContext, args: string[]) => {
        const req: ButtonInteraction = ctx.data as any;

        const game = games[Number.parseInt(args[0])]

        if (req.member.user.id != game.player.user.id) {
            (req.message.components as unknown as ActionRow).components.forEach((e) => ctx.addRow(e as any))
            ctx.replyEmbed(req.message.embeds[0])
            return
        }

        game.board[parseInt(args[1])][parseInt(args[2])] = 1;

        //TODO AI


        //Checking wins
        console.log(JSON.stringify(game.board));
        
        //Rows
        for (let i = 0; i < 3; i++) {
            const row: number[] = game.board[i];
            if (row.filter((e) => e == 1).length == 3) {
                game.win = true;
                game.isBotWon = false
            } else if (row.filter(e => e == 2).length == 3) {
                game.win = true;
                game.isBotWon = true
            }
        }

        if (!game.win) {
            for (let i = 0; i < 3; i++) {
                if (game.board[0][i] == game.board[1][i] == game.board[2][i] && game.board[0][i] != 0) {
                    game.win = true;
                    game.isBotWon = game.board[0][i] == 2
                }
            }
        }

        if (!game.win) {
            const cross = [ game.board[0][0],
                            game.board[1][1],
                            game.board[2][2]]
            if (game.board[0][0] == game.board[1][1] == game.board[2][2] && game.board[0][0] != 0) {
                game.win = true
                game.isBotWon = game.board[0][0] == 2
            }
        }
/*
        if (!game.win) {
            if (game.board[2][0] == game.board[1][1] == game.board[0][2] && game.board[2][0] != 0) {
                game.win = true
                game.isBotWon = game.board[2][0] == 2
            }
        }*/
        

        for (let i = 0; i < 3; i++) {
            const row1 = new ActionRow();
            for (let k = 0; k < 3; k++) {
                const cell = game.board[i][k];

                row1.addComponent(new ButtonComponent(cell == 0 ? " " : cell == 1 ? "❌" : "⭕", ButtonStyle.SECONDARY)
                .setCustomId(`ed_cmd_amőba_${args[0]}_${i}_${k}`).disable(cell != 0 || game.win))
            }
            ctx.addRow(row1)
        }


        if (!game.win) ctx.replyEmbed(req.message.embeds[0])
        else {
            if (game.isBotWon) {
                ctx.replyEmbed(new MessageEmbed()
                    .setTitle(`Amőba`)
                    .setColor(`RED`)
                    .setDescription(`**Vesztettél!**\nTalán máskor több szerencséd lesz.`))
            } else {
                ctx.replyEmbed(new MessageEmbed()
                    .setTitle(`Amőba`)
                    .setColor(`GREEN`)
                    .setDescription(`**Nyertél!**\nGratulálok.`))
            }
        }
    })
    .executes(async (ctx: CommandContext) => {
        const embed = new MessageEmbed()
            .setTitle(`Amőba`)
            .setDescription(`${ctx.ranBy.user.username} követezik.`)
            .setColor(`BURPLE`)

        const id = Math.round(Math.random() * 99999)

        for (let i = 0; i < 3; i++) {
            const row1 = new ActionRow();
            for (let k = 0; k < 3; k++) {
                row1.addComponent(new ButtonComponent(" ", ButtonStyle.SECONDARY).setCustomId(`ed_cmd_amőba_${id}_${i}_${k}`))
            }
            ctx.addRow(row1)
        }

        games[id] = {
            player: ctx.ranBy,
            board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
            isBotCurrent: false,
            win: false,
            isBotWon: false
        };

        ctx.replyEmbed(embed)
    })