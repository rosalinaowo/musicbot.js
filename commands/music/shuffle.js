const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
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

        queue.tracks.shuffle();
        return interaction.reply(`:notes: Shuffled ${queue.tracks.size} songs`);
    }
}