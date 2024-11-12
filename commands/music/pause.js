const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the player.'),
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

        if (queue.node.isPaused()) {
            queue.node.setPaused(false);
            return interaction.reply(':arrow_forward: Unpaused!');
        } else {
            queue.node.setPaused(true);
            return interaction.reply(':pause_button: Paused!');
        }
    }
}