async function getGuilds(client) {
    if (!client.isReady()) {
        console.error('The bot is not ready yet.');
        return null;
    }
    
    var guilds = client.guilds.cache;
    if (guilds.size === 0) { await client.guilds.fetch(); }
    return guilds;
}

async function getGuild(client, guildId) {
    if (!client.isReady()) {
        console.error('The bot is not ready yet.');
        return null;
    }

    let guild = client.guilds.cache.get(guildId);
    if (!guild) {
        try {
            guild = await client.guilds.fetch(guildId);
        } catch {}
    }

    return guild;
}

async function getGuildPlayerStatus(client, guildId) {
    const guild = await getGuild(client, guildId);
    if (!guild) {
        console.error(`Guild ${guildId} not found.`);
        return null;
    }

    const playerNode = client.player.nodes.get(guildId);
    if (!playerNode) {
        console.error(`Player node for guild ${guildId} not found.`);
        return null;
    }

    return playerNode;
}

module.exports = { getGuilds, getGuild, getGuildPlayerStatus }