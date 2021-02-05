import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { CommandResponse } from '../types/CommandResponse';
import { RedditSimple } from '@ipmanlk/reddit-simple';
import { randomFromArray } from '../utils';

export default {
    name: 'meme',
    description: 'Küld egy random mémet.',
    id: '806905285976784969',
    requiesOwner: false,
    run: async function (bot: Client, tc: TextChannel, data: CommandResponse) {
        const embed = new MessageEmbed()
            .setTitle("Meme")
            .setTimestamp(Date.now())
            .setColor('RANDOM')
            .setAuthor("EdwardBot", bot.user.avatarURL())
            .setDescription('Keresés...')
            .setFooter(`Lefuttatta: ${data.member.user.username}#${data.member.user.discriminator}`);
        const msg = await tc.send(embed)
        const meme = await findMeme();
        embed.setDescription('')
            .setImage(meme.img)
            .setURL(meme.url)
            .setTitle(meme.title);
        msg.edit(embed);
    }
}

const subreddits = ['dankmemes', 'holdup', 'cursedcomments', 'memes']

interface MemeResponse {
    img: string;
    url: string;
    title: string;
}

async function findMeme(): Promise<MemeResponse> {
    const meme = await RedditSimple.RandomPost(randomFromArray(subreddits))
    const m = {
        img: meme[0].data.url,
        title: meme[0].data.title,
        url: 'https://reddit.com' + meme[0].data.permalink
    }
    return m;
}