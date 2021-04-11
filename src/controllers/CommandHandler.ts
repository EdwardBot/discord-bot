import { Collection, MessageEmbed, PermissionString } from "discord.js"
import { readdir } from "fs/promises"
import { Bot } from "../bot"
import { CommandResponse } from "../types/CommandResponse"
import { CommandCategory } from "../types/CommandTypes"

export class CommandHandler {
    commands: Collection<string, Command>
    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
        bot.bot.ws.on((`INTERACTION_CREATE` as any), this.onCommand)
    }

    /**
     * load
     */
    public async load() {
        console.log(`Loading commands...`)
        const cmds = await readdir(`${process.cwd()}/src/commands`)
        cmds.forEach((cmd) => {
            const tmp = (require(`../commands/${cmd}`).default as Command)
            this.commands.set(tmp.id, tmp)
            console.log(`Loaded command ${tmp.name}`);
            
        })
        console.log(`Loaded commands!`)
    }

    public async onCommand(data: CommandResponse, shardId: number) {
        if (data.type == 1) {
            (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                data: {
                    type: 1
                }
            })
            return
        }
        if (this.commands.has(data.data.id)) {

        } else {
            (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                data: {
                    type: 3
                }
            })
        }
    }
}

export type CommandInfo = {
    name: string,
    description: string,
    id: string,
    requiesOwner: boolean,
    requiedPermissions: Array<PermissionString>,
    category: CommandCategory
}

export class CommandContext {
    response: CommandResult

    constructor () {
        this.response = new CommandResult()
    }

    public replyMessage(msg: string | MessageEmbed) {

    }
}

export class CommandResult {
    responded: boolean
    isSuccessfull: boolean
}

export class Command {
    name: string
    description: string
    id: string
    requiesOwner: boolean
    requiedPermissions: Array<PermissionString>
    category: CommandCategory
    execute: Function

    public setInfo(info: CommandInfo): Command {
        this.name = info.name
        this.description = info.description
        this.id = info.id
        this.requiesOwner = info.requiesOwner
        this.requiedPermissions = info.requiedPermissions
        return this
    }

    constructor () {
        this.requiedPermissions = []
    }

    public onlyOwner(): Command {
        this.requiesOwner = true;
        return this;
    }

    public setName(name: string): Command {
        this.name = name;
        return this;
    }

    public setDescription(desc: string): Command {
        this.description = desc;
        return this;
    }

    public setId(id: string): Command {
        this.id = id;
        return this;
    }

    public setCategory(category: CommandCategory): Command {
        this.category = category;
        return this;
    }

    public addRequiredPermission(perm: PermissionString): Command {
        this.requiedPermissions.push(perm);
        return this;
    }

    public executes(fun: Function): Command {
        this.execute = fun;
        return this;
    }

    public run(ctx: CommandContext) {
        this.execute.call(this, ctx)
    }
}
