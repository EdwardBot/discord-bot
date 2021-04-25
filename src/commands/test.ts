import { Command, CommandContext } from "../controllers/CommandHandler";
import { CommandCategory } from "../types/CommandTypes";

const cmd = new Command()
    .setName(`test`)
    .setDescription(`Test command`)
    .setId(`830807850006872114`)
    .addRequiredPermission(`ADD_REACTIONS`)
    .addRequiredPermission(`ATTACH_FILES`)
    .onlyOwner()
    .setCategory(CommandCategory.FUN)
    .executes(async function(ctx: CommandContext) {
        ctx.setLoading()
        setTimeout(() => {
            ctx.replyString(`New command system do be looking kinda THICCCC`)
            setTimeout(() => {
                ctx.deleteResponse()
            }, 5000)
        }, 1000)
    })

export default cmd;
