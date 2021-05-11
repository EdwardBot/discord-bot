import axios from "axios"
import { Client, Collection, GuildMember, Message, MessageEmbed, PermissionString, TextChannel } from "discord.js"
import { readdir } from "fs/promises"
import { Bot } from "../bot"
import { CommandResponse } from "../types/CommandResponse"
import { CommandCategory } from "../types/CommandTypes"
import { noPermMsg } from "../utils"

//Clean code™️
export class CommandHandler {
    public static readonly ERROR_NO_COMMAND = {
        title: "Hiba!",
        type: "rich",
        description: "Hiba történt a parancs lefuttatása közben!\n" +
            "A parancs nincs betöltve.\n" +
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
        console.log(`[CommandManager] Loading commands...`)
        const cmds = await readdir(`${process.cwd()}/src/commands`)
        this.commands = new Collection()
        cmds.forEach((cmd) => {
            try {
                const tmp = (require(`../commands/${cmd}`).default as Command)
                this.commands.set(tmp.id, tmp)
                console.log(`[CommandManager] Loaded command ${tmp.name}`);
            } catch (e) {
                console.error(`[CommandManager] Error loading command: ${cmd}`);
            }

        })
        console.log(`[CommandManager] Loaded commands!`)
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
            const member = this.bot.bot.guilds.cache.get(data.guild_id).members.cache.get(data.member.user.id)
            console.log(`[CommandHandler] User ${member.user.username}#${member.user.discriminator}(${member.user.id}) ran command /${cmd.name}`);
            let canRun = !cmd.requiesOwner
            let needs = [];
            cmd.requiedPermissions.forEach((e) => {
                if (!member.hasPermission(e)) {
                    canRun = false;
                    needs.push(e)
                }
            })
            const ctx = new CommandContext(this.bot.bot, data)
            if (canRun) {
                cmd.run(ctx)
                this.bot.databaseHandler.incrementCommandsRun();
            } else {
                ctx.replyEmbed(noPermMsg(data.member.user, needs.join(`, `)))
            }
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

    /**
     * runTrick
     */
    public async runTrick(name: string, args: string[], msg: Message) {
        switch (name) {
            case `reload`:
                if (args.length != 1) {
                    msg.channel.send(`Adj meg parancsot!`)
                    break
                }
                try {
                    const tmp = (require(`../commands/${args[0]}`).default as Command)
                    this.commands.delete(this.commands.find((c) => c.name == tmp.name)?.id)
                    this.commands.set(tmp.id, tmp)
                    msg.channel.send(`Parancs újratöltve: \`${tmp.name}\``)
                } catch (e) {
                    msg.channel.send(`Hiba a parancs újratöltése közben!\n${e}`)
                }
                break;

            case `stop`:
                await msg.channel.send(`Leállítás...`)
                process.exit(0)

            case `dg`:
                await msg.channel.send(`\`\`\`${this.bot.bot.guilds.cache.array().map((g) => g.name).join(`,\n`)}\`\`\``)
                break
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
    textChannel: TextChannel
    ranBy: GuildMember

    /**
     * Creates a CommandContext
     * @param bot the bot instance
     */
    constructor(bot: Client, data: CommandResponse) {
        this.response = new CommandResult()
        this.bot = bot
        this.data = data
        this.textChannel = bot.channels.cache.get(data.channel_id) as TextChannel
        this.ranBy = this.textChannel.guild.members.cache.get(data.member.user.id)
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

    /**
     * sendError
     */
    public sendError() {
        this.replyString(`Ismeretlen hiba történt!`, true)
    }

    public async replyString(msg: string, empheral?: boolean) {
        if (this.response.responded) {
            const { status, data } = await axios.patch(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`, {
                tts: false,
                content: msg,
                embeds: []
            })
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
                        embeds: [],
                        flags: empheral ? 64 : 0
                    }
                }
            })
            this.response.responded = true;
        }
    }

    /**
     * deleteResponse - Deletes the original response
     */
    public async deleteResponse() {
        const { status } = await axios.delete(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`)
        if (status != 204) {
            console.error(`Error deleting message`)
        }
    }

    public async replyEmbed(msg: MessageEmbed, empheral?: boolean) {
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
            (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        content: "",
                        allowed_mentions: [],
                        embeds: [msg],
                        flags: empheral ? 64 : 0
                    }
                }
            })
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

    constructor() {
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
