async function getGuilds(client) {
    if (!client.isReady()) {
        console.error('The bot is not ready yet.');
        return new Collection();
    }
    
    var guilds = client.guilds.cache;
    if (guilds.size === 0) { await client.guilds.fetch(); }
    console.dir(guilds);
    return guilds;
}

module.exports = { getGuilds }