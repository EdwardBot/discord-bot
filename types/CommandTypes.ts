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
