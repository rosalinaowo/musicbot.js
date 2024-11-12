const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');
const { GetTrackInfo } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current queue.'),
    async execute(interaction) {
        const player = useMainPlayer();

        const queue = player.nodes.get(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.reply(':x: The queue is empty.');
        }
        
        await interaction.deferReply();

        //let queueStrings = [];
        let msg = `:notes: Current queue: ${queue.tracks.size} entr${queue.tracks.size > 1 ? "ies" : "y"}\n`;

        for (let i = 0; i < queue.tracks.size; i++) {
            console.dir(queue.tracks.at(i));
            let trackDesc = `${i+1}. ${GetTrackInfo(queue.tracks.at(i))}\n`;

            if ((msg + trackDesc).length > 2000) {
                //queueStrings.push(trackDesc);
                interaction.followUp(msg);
                msg = "";
            } else {
                msg += trackDesc;
            }
        }
        
        return interaction.followUp(msg);
    }
}