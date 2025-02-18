const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');
const { GetTrackInfo } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to the specified song.')
        .addNumberOption(option => 
            option.setName('index')
                .setDescription('The track index to skip to.')
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

        const trackindex = interaction.options.getNumber('index') - 1;
        if (trackindex < 1 || trackindex > queue.tracks.size) {
            return interaction.reply({ content: ':x: Provide a valid index.', ephemeral: true });
        }

        const track = queue.tracks.at(trackindex);
        queue.node.skipTo(track);
        return interaction.reply(`:fast_forward: Skipped to: ${GetTrackInfo(track)}`);
    }
}