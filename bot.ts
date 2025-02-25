import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { GuildQueue, Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { token } from './config.json';
import { PlayerClient } from './types';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] }) as PlayerClient;
client.player = new Player(client);

async function startBot() {
    await client.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
    client.player.extractors.register(YoutubeiExtractor, {});

    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.on(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    client.login(token);

    client.player.on('error', (error: Error) => {
        console.error(`Error emitted from the queue: ${error.message}`);
    });
};

export { client, startBot };