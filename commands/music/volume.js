const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Show or set the players volume.')
        .addNumberOption(option => 
            option.setName('volume')
                .setDescription('The volume to set.')
                .setRequired(false)),
    async execute(interaction) {
        const maxVol = 300;
        const player = useMainPlayer();
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ content: ':x: You are not in a voice channel.', ephemeral: true });
        }

        const queue = player.nodes.get(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.reply({ content: ':x: There is no song currently playing.', ephemeral: true });
        }

        const volume = interaction.options.getNumber('volume');
        if (!volume) {
            return interaction.reply(`:information_source: Current volume is ${queue.node.volume}`);
        }
        if (volume < 0 || volume > maxVol) {
            return interaction.reply({ content: `:x: Invalid value provided (0-${maxVol}).`, ephemeral: true });
        }
        
        queue.node.setVolume(volume);
        return interaction.reply(`:information_source: Set the volume to ${volume}`);
    }
}