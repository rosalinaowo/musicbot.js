const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');
const { GetTrackInfo } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes the specified song.')
        .addNumberOption(option => 
            option.setName('index')
                .setDescription('The track index to remove.')
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

        const trackIndex = interaction.options.getNumber('index') - 1;
        if (trackIndex < 0 || trackIndex > queue.tracks.size) {
            return interaction.reply({ content: ':x: Provide a valid index.', ephemeral: true });
        }
        
        const track = queue.tracks.at(trackIndex);
        queue.removeTrack(track);
        return interaction.reply(`:white_check_mark: Removed ${GetTrackInfo(track)}`);
    }
}