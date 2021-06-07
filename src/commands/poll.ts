//851401048563515402

import { Command, CommandContext } from "../controllers/CommandHandler";
import { CommandCategory } from "../types/CommandTypes";

export default new Command()
    .setId(`851401048563515402`)
    .setName(`szavazás`)
    .setDescription(`Szavazást indít`)
    .addRequiredPermission(`MANAGE_GUILD`)
    .setCategory(CommandCategory.GENERAL)
    .setOnClick((ctx: CommandContext, args: string[]) => {

    })
    .executes((ctx: CommandContext) => {
        ctx.replyString(`Még nincs kséz.`)
    })