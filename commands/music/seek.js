const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seeks to a specific timestamp in the current song.')
        .addStringOption(option => 
            option.setName('timestamp')
                .setDescription('The timestamp to skip to (e.g. 1:23).')
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ content: ':x: You are not in a voice channel.', ephemeral: true });
        }

        const queue = player.nodes.get(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: ':x: There is no song currently playing.', ephemeral: true });
        }
        const timestamp = interaction.options.getString('timestamp');

        const parts = timestamp.split(':').reverse();
        if (isNaN(parts[0])) {
            return interaction.reply({ content: ':x: Invalid timestamp provided.', ephemeral: true });
        }
        const seconds = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        const hours = parseInt(parts[2]) || 0;
        const totalMilliseconds = (hours * 3600 + minutes  * 60 + seconds) * 1000;

        if (totalMilliseconds < 0 || parts.totalMilliseconds > queue.currentTrack.durationMS) {
            return interaction.reply({ content: ':x: The specified timestamp is beyond the track\'s duration.', ephemeral: true });
        }
        
        queue.node.seek(totalMilliseconds);
        return interaction.reply(`:information_source: Skipped to ${timestamp}`);
    }
}