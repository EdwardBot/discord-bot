import { Command, CommandContext } from "../controllers/CommandHandler";
import { CommandCategory } from "../types/CommandTypes";

const cmd = new Command()
    .setName(`test`)
    .setDescription(`Test command`)
    .setId(`Id`)
    .addRequiredPermission(`ADD_REACTIONS`)
    .addRequiredPermission(`ATTACH_FILES`)
    .onlyOwner()
    .setCategory(CommandCategory.FUN)
    .executes(async function(ctx: CommandContext) {
        ctx.replyMessage(`New command system do be looking kinda THICCCC`)
    })

export default cmd;
