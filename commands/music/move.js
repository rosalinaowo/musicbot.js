const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');
const { GetTrackInfo } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move the specified song to the specified index.')
        .addNumberOption(option => 
            option.setName('from')
                .setDescription('The index of the track to move.')
                .setRequired(true))
        .addNumberOption(option => 
            option.setName('to')
                .setDescription('The index to move the track to.')
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

        const from = interaction.options.getNumber('from') - 1;
        const to = interaction.options.getNumber('to') - 1;
        if (from < 0 || from > queue.tracks.size || to < 0) {
            return interaction.reply({ content: ':x: Provide a valid indexes.', ephemeral: true });
        }
        
        const track = queue.tracks.at(from);
        queue.moveTrack(track, to);
        return interaction.reply(`:white_check_mark: Move ${GetTrackInfo(track)} to position **${to < queue.tracks.size ? to + 1 : queue.tracks.size}**`);
    }
}