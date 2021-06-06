import axios from "axios"
import { Client, Collection, EmojiResolvable, GuildMember, Message, MessageEmbed, PermissionString, TextChannel } from "discord.js"
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
            "Ha a hiba továbbra is fennáll, csatlakozz a Discord szerverünkre és segítünk!\n" +
            "Meghívó: [Kattints ide](https://dc.edwardbot.tk)",
        color: 0xee5253,
    }


    commands: Collection<string, Command>
    bot: Bot
    logs: Collection<string,string[]>

    constructor(bot: Bot) {
        this.bot = bot;
        bot.bot.ws.on((`INTERACTION_CREATE` as any), (data, shard) => this.onCommand(data, shard))
        this.logs = new Collection()
    }

    /**
     * load
     */
    public async load() {
        console.log(`[CommandManager] Loading commands...`)
        const cmds = await readdir(`${process.cwd()}/src/commands`)
        this.commands = new Collection()
        cmds.forEach((cmd) => {
            const name = cmd.slice(0, cmd.length - 3)
            if (!this.logs.has(name)) this.logs.set(name, [`Logs for command ${name}`])
            try {
                const tmp = (require(`../commands/${cmd}`).default as Command)
                this.commands.set(tmp.id, tmp)
                console.log(`[CommandManager] Loaded command ${tmp.name}`);
                this.logs.get(name).push(`[CommandManager] Loaded command ${tmp.name}`)
            } catch (e) {
                console.error(`[CommandManager] Error loading command: ${name}`);
                this.logs.get(name).push(`[CommandManager] Error loading command: ${name}\n[CommandManager] Stacktrace: ${e}`)
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


            //Log it
            if (this.logs.get(cmd.name)) {
                this.logs.get(cmd.name).push(`[CommandHandler] User ${member.user.username}#${member.user.discriminator}(${member.user.id}) ran command /${cmd.name}`)
            }
        } else if (data.type === 3) {
            //Handle button logic
            const id: string = (data.data as any).custom_id;

            if (!id.startsWith(`ed`)) return

            const idPath = id.split(`_`).slice(1)
            const interaction = data as any

            if (idPath[0] === `cmd`) {
                const name = idPath[1]
                const args = idPath.slice(2)

                const cmd = this.commands.find((v) => v.name == name);

                if (cmd == undefined) {
                    (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                        data: {
                            type: 7,
                            data: {
                                tts: false,
                                content: "",
                                allowed_mentions: [],
                                embeds: [CommandHandler.ERROR_NO_COMMAND],
                                flags: 64
                            }
                        }
                    })
                    return
                }
                if (cmd.onButtonClick == undefined) {
                    (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                        data: {
                            type: 1
                        }
                    })
                    return
                }
                cmd.onButtonClick.call(this, new CommandContext(this.bot.bot, interaction, true), args)
            }
        } else {
            
            (this.bot.bot as any).api.interactions(data.id, data.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        tts: false,
                        content: "",
                        allowed_mentions: [],
                        embeds: [CommandHandler.ERROR_NO_COMMAND],
                        flags: 64
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

            case `logs`:
                msg.channel.send(`\`\`\`${this.logs.get(args[0]).join(`\n`)}\`\`\``)
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

export class Component {
    type: number

    constructor() {
        this.type = 2
    }
}

export class ButtonComponent extends Component {
    label: string
    custom_id?: string
    url?: string
    emoji: EmojiResolvable
    disabled: boolean
    style: number

    constructor(label: string, style: number) {
        super()
        this.label = label;
        this.style = style; 
        this.url = ""
        this.custom_id = ""
    }

    /**
     * setCustomId
     */
    public setCustomId(id: string): ButtonComponent {
        if (this.style == ButtonStyle.LINK) throw new Error(`Can't assign an id to a Url button!`)
        this.custom_id = id
        return this
    }

    /**
     * setEmoji
     */
    public setEmoji(emoji: EmojiResolvable): ButtonComponent {
        this.emoji = emoji
        return this
    }

    /**
     * setUrl
     */
    public setUrl(url: string): ButtonComponent {
        if (this.style != ButtonStyle.LINK) throw new Error(`Can't assign a url to a non Url button!`)
        this.url = url
        return this
    }

    /**
     * disable
     */
    public disable(): ButtonComponent {
        this.disabled = true
        return this
    }
}

export const ButtonStyle = {
    PRIMARY: 1,
    SECONDARY: 2,
    SUCCESS: 3,
    DANGER: 4,
    LINK: 5
}

Object.freeze(ButtonStyle)

export class ActionRow {
    components: Component[]
    type: number

    constructor() {
        this.components = []
        this.type = 1
    }

    /**
     * addComponent
     */
    public addComponent(c: Component) {
        this.components.push(c)
    }
}

export class CommandContext {
    response: CommandResult
    loading: boolean
    bot: Client
    data: CommandResponse
    textChannel: TextChannel
    ranBy: GuildMember
    components: ActionRow[]
    button: boolean

    /**
     * Creates a CommandContext
     * @param bot the bot instance
     */
    constructor(bot: Client, data: CommandResponse, isButton?: boolean) {
        this.response = new CommandResult()
        this.bot = bot
        this.data = data
        this.textChannel = bot.channels.cache.get(data.channel_id) as TextChannel
        this.ranBy = this.textChannel.guild.members.cache.get(data.member.user.id)
        this.components = []
        this.button = isButton === true
    }

    /**
     * Sets the message as loading
     */
    public setLoading() {
        this.loading = true;
        this.response.responded = true;
        (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
            data: {
                type: this.button ? 6 : 5
            }
        });
    }

    /**
     * addRow
     */
    public addRow(row: ActionRow) {
        this.components.push(row)
    }

    /**
     * getRow
     */
    public getRow(id: number): ActionRow {
        return this.components[id];
    }

    /**
     * sendError
     */
    public sendError() {
        this.replyString(`Ismeretlen hiba történt!`, true)
    }

    /**
     * sendPong - ACKs the interaction
     */
    public async sendPong() {
        await (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
            data: {
                type: 1
            }
        })
        this.response.responded = true
    }

    public async replyString(msg: string, empheral?: boolean) {
        if (this.response.responded) {
            const { status, data } = await axios.patch(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`, {
                tts: false,
                content: msg,
                embeds: [],
                flags: empheral ? 64 : 0,
                components: this.components
            })
            this.response.reply = data
            if (status != 200) {
                (this.bot.channels.cache.get(this.data.channel_id) as TextChannel).send(`Hiba a parancs futtatása során: ${status}`)
            }
        } else {
            await (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
                data: {
                    type: this.button ? 7 : 4,
                    data: {
                        tts: false,
                        content: msg,
                        allowed_mentions: [],
                        embeds: [],
                        flags: empheral ? 64 : 0,
                        components: this.components
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
        let flags = 0;
        if (empheral === true) flags = 64;
        if (this.response.responded) {
            const { status, data } = await axios.patch(`https://discord.com/api/v6/webhooks/747157043466600477/${this.data.token}/messages/@original`, {
                tts: false,
                content: "",
                embeds: [msg],
                flags: flags,
                components: this.components
            })
            this.response.reply = data
            if (status != 200) {
                (this.bot.channels.cache.get(this.data.channel_id) as TextChannel).send(`Hiba a parancs futtatása során: ${status}`)
            }
        } else {
            (this.bot as any).api.interactions(this.data.id, this.data.token).callback.post({
                data: {
                    type: this.button ? 7 : 4,
                    data: {
                        tts: false,
                        content: "",
                        allowed_mentions: [],
                        embeds: [msg],
                        flags: flags,
                        components: this.components
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
    onButtonClick: Function

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

    /**
     * setOnClick
     */
    public setOnClick(fun: Function): Command {
        this.onButtonClick = fun;
        return this;
    }
}
