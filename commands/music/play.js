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
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({ content: ':x: You are not in a voice channel.', ephemeral: true });
        }
        const query = interaction.options.getString('query');

        await interaction.deferReply();

        //console.log(interaction.client.player);

        console.dir(interaction.member);

        try {
            const { track } = await player.play(vc, query, {
                nodeOptions:  {
                    metadata: interaction
                }
            });
            
            return interaction.followUp(`:notes: Adding **${GetTrackInfo(track)}** to the queue!`);
        } catch (err) {
            console.error(`Error while getting track:`, err);
            return interaction.followUp({ content: `:x: Something went wrong: ${err}`, ephemeral: true });
        }
    }
}