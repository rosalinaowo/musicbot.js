const { getCircularReplacer } = require('./utils');
const { client, startBot } = require('./bot');
const { getGuilds, getGuild, getGuildPlayerStatus } = require('./controller');

const express = require('express');

const PORT = 7500;
const app = express();

app.use(express.json());

app.get('/guilds', async (req, res) => {
    const guilds = await getGuilds(client);
    res.json(guilds);
});

app.post('/guild', async (req, res) => {
    const guild = await getGuild(client, req.body.guildId);
    res.json(guild);
});

app.post('/guildPlayerStatus', async (req, res) => {
    try {
        const playerNode = await getGuildPlayerStatus(client, req.body.guildId);

        // const { channel, connection, currentTrack, isShuffling, tracks } = playerNode;
        // const cleanNode = { channel, connection, currentTrack, isShuffling, tracks };

        res.json(cleanNode);
    } catch (err) {
        console.error('Caught!', err);
        res.json(null);
    }
});

startBot().then(() => {
    app.listen(PORT, () => {
        console.log(`API running on port ${PORT}`);
    });
});