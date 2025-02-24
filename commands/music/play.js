const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');
const { GetTrackInfo } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add a song from URL or search query to the queue.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The URL or search query for the song.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('playfirst')
                .setDescription('Places the track as the first in the queue.')
                .setRequired(false)),
    async execute(interaction) {
        const player = useMainPlayer();
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ content: ':x: You are not in a voice channel.', ephemeral: true });
        }
        const query = interaction.options.getString('query');
        var playFirst = interaction.options.getBoolean('playfirst');

        await interaction.deferReply();
        
        try {
            const result = await player.search(query, {
                requestedBy: interaction.user
            });

            if (!result || !result.tracks.length) {
                return interaction.followUp({ content: `:x: No track found for ${query}.`, ephemeral: true });
            }

            const { playlist, tracks } = result;
            const queue = player.nodes.create(interaction.guild, {
                metadata: interaction,
                selfDeaf: true
            });

            try {
                if (!queue.connection) await queue.connect(vc);
            } catch (err) {
                console.error(err);
                queue.destroy();
                return interaction.followUp({ content: 'Could not join your voice channel.', ephemeral: true });
            }

            if (playlist) {
                for (const track of tracks) {
                    track.metadata = interaction;
                    queue.addTrack(track);
                }
                if (!queue || !queue.currentTrack) {
                    queue.node.play();
                }
                return interaction.followUp(`:notes: Adding **${tracks.length}** tracks to the queue!`);
            } else {
                const track = tracks[0];
                track.metadata = interaction;
                if (playFirst) {
                    queue.insertTrack(track, 0);
                    return interaction.followUp(`:notes: Adding **${GetTrackInfo(tracks[0])}** as the next track!`);
                } else {
                    queue.play(track);
                    return interaction.followUp(`:notes: Adding **${GetTrackInfo(tracks[0])}** to the queue!`);
                }
            }
        } catch (err) {
            console.error(`Error while getting track:`, err);
            return interaction.followUp({ content: `:x: Something went wrong: ${err}`, ephemeral: true });
        }
    }
}