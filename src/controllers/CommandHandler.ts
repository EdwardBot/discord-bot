import axios from "axios"
import { Client, Collection, Message, MessageEmbed, PermissionString, TextChannel } from "discord.js"
import { readdir } from "fs/promises"
import { Bot } from "../bot"
import { CommandResponse } from "../types/CommandResponse"
import { CommandCategory } from "../types/CommandTypes"

export class CommandHandler {
    public static readonly ERROR_NO_COMMAND = {
        title: "Hiba!",
        type: "rich",
        description: "Hiba történt a parancs lefuttatása közben!\n" +
            "Ha a hiba továbbra is fennál, csatlakozz a Discord szerverünkre és segítünk!\n" +
            "Meghívó: https://dc.edwardbot.tk",
        color: 16711680,
    }


    commands: Collection<string, Command>
    bot: Bot

    constructor(bot: Bot) {
        this.bot = bot;
        bot.bot.ws.on((`INTERACTION_CREATE` as any), (data, shard) => this.onCommand(data, shard))
    }

    /**
     * load
     */
    public async load() {
        console.log(`Loading commands...`)
        const cmds = await readdir(`${process.cwd()}/src/commands`)
        this.commands = new Collection()
        cmds.forEach((cmd) => {
            const tmp = (require(`../commands/${cmd}`).default as Command)
            this.commands.set(tmp.id, tmp)
            console.log(`Loaded command ${tmp.name}`);
            
        })
        console.log(`Loaded commands!`)
    }

    /** 
     * Runs when a command is executed.
     * @param data interaction data
     * @param shardId magic discord number
    */
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
            const cmd = this.commands.get(data.data.id)
            const ctx = new CommandContext(this.bot.bot, data)
            cmd.run(ctx)
        } else {
            (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        content: "",
                        allowed_mentions: [],
                        embeds: [CommandHandler.ERROR_NO_COMMAND]
                    }
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
    loading: boolean
    bot: Client
    data: CommandResponse

    /**
     * Creates a CommandContext
     * @param bot the bot instance
     */
    constructor (bot: Client, data: CommandResponse) {
        this.response = new CommandResult()
        this.bot = bot
        this.data = data
    }

    /**
     * Sets the message as loading
     */
    public setLoading() {
        this.loading = true;
        this.response.responded = true;
        (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
            data: {
                type: 5
            }
        });
    }

    public async replyString(msg: string) {
        if (this.response.responded) {
            const {status, data} = await axios.patch(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`, {
                tts: false,
                content: msg,
                embeds: []
            })
            console.log(JSON.stringify(data));
            this.response.reply = data
            if (status != 200) {
                (this.bot.channels.cache.get(this.data.channel_id) as TextChannel).send(`Hiba a parancs futtatása során: ${status}`)
            }
        } else {
            const res: Buffer = await (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        content: msg,
                        allowed_mentions: [],
                        embeds: []
                    }
                }
            })
            console.log(res.toJSON())
            this.response.responded = true;
        }
    }

    /**
     * deleteResponse - Deletes the original response
     * 
     */
    public async deleteResponse() {
        const {status} = await axios.delete(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`)
        if (status != 204) {
            console.error(`Error deleting message`)
        }
    }

    public async replyEmbed(msg: MessageEmbed) {
        if (this.response.responded) {
            const { status, data } = await axios.patch(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`, {
                tts: false,
                content: "",
                embeds: [msg]
            })
            this.response.reply = data
            if (status != 200) {
                (this.bot.channels.cache.get(this.data.channel_id) as TextChannel).send(`Hiba a parancs futtatása során: ${status}`)
            }
        } else {
            console.log((this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        content: "",
                        allowed_mentions: [],
                        embeds: [msg]
                    }
                }
            }))
            this.response.responded = true;
        }
    }
}

export class CommandResult {
    responded: boolean
    isSuccessfull: boolean
    reply: Message
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
