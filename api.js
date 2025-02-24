const { client, startBot } = require('./bot');
const { getGuilds } = require('./controller');

const express = require('express');

const PORT = 7500;
const app = express();

app.get('/getGuilds', async (req, res) => {
    const guilds = await getGuilds(client);
    res.json(guilds);
});

startBot().then(() => {
    app.listen(PORT, () => {
        console.log(`API running on port ${PORT}`);
    });
});