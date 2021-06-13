import { GuildMember, Message, User } from "discord.js";
import { ActionRow } from "../controllers/CommandHandler";

export enum CommandCategory {
    GENERAL = "Általános",
    MODERATION = "Moderáció",
    FUN = "Szórakozás",
    INFO = "Infó",
    MUSIC = "Zene",
    MISC = "Egyéb"
    
}

export const categories = [
    CommandCategory.GENERAL,
    CommandCategory.MODERATION,
    CommandCategory.FUN,
    CommandCategory.INFO,
    CommandCategory.MUSIC,
    CommandCategory.MISC
]

export type SfwWaifu = `waifu` | `neko` | `shinobu` | `megumin` | `bully` | `cuddle` | `cry` | `hug` | `awoo` | `kiss` | `lick` | `pat` 
                | `smug` | `bonk` | `yeet` | `blush` | `smile` | `wave` | `highfive` | `handhold` | `nom` | `bite` | `glomp` | `kill` 
                | `slap` | `happy` | `wink` | `poke` | `dance` | `cringe`; 

export const sfwWaifus = [
    `waifu`,
    `neko`,
    `shinobu`,
    `megumin`,
    `bully`,
    `cuddle`,
    `cry`,
    `hug`,
    `awoo`,
    `kiss`,
    `lick`,
    `pat`,
    `smug`,
    `bonk`,
    `yeet`,
    `blush`,
    `smile`,
    `wave`,
    `highfive`,
    `handhold`,
    `nom`,
    `bite`,
    `glomp`,
    `kill`,
    `slap`,
    `happy`,
    `wink`,
    `poke`,
    `dance`,
    `cringe`
]

export interface ButtonInteraction {
    version:        number;
    type:           number;
    token:          string;
    message:        Message & { components: ActionRow[] };
    member:         GuildMember;
    id:             string;
    guild_id:       string;
    data:           Data;
    channel_id:     string;
    application_id: string;
}

export interface Data {
    custom_id:      string;
    component_type: number;
}

export interface Interaction {
    user: User;
    type: number;
    name: string;
    id:   string;
}
