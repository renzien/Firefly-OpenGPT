require('dotenv/config');
const { Client } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
    console.log('Firefly Ready to Go!');
})

const IGNORE_PREFIX = '!';
const CHANNELS = ['1250100125544616046', '1250100148999164050'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
})

// CLI Pesan diketik oleh User
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Cek apakah pesan diawali dengan IGNORE_PREFIX
    if (message.content.startsWith(IGNORE_PREFIX)) return;

    // Cek apakah pesan dikirim di channel yang diizinkan
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    // name:
                    role: 'system',
                    content: 'Firefly is Friendly Girl from Honkai Star Rail.',
                },
                {
                    // name:
                    role: 'user',
                    content: message.content,
                },
            ],
        })
        .catch((error) => console.error('Critical Error, Firefly Stop Working Because:\n', error));
    
    message.reply(response.choices[0].message.content);
});

client.login(process.env.TOKEN);