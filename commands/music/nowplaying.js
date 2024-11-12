const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } =  require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Shows the currently playing song.'),
    async execute(interaction) {
        const player = useMainPlayer();

        const queue = player.nodes.get(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
            return interaction.reply(':x: There is no song currently playing.');
        }

        await interaction.deferReply();

        const track = queue.currentTrack;
        // console.log("------------------\n");
        // console.dir(track.metadata);
        // const requestedBy = track.metadata.interaction.member.user;
        const trackEmbed = new EmbedBuilder()
            .setColor(0xd966ff)
            .setTitle(track.title)
            .setURL(track.url)
            //.setDescription(`[${track.title}](${track.url})`)
            .setAuthor({ name: track.author })
            .addFields(
                { name: queue.node.createProgressBar({ timecodes: true }), value: " ", inline: false }
            )
            .setThumbnail(track.thumbnail)
            //.setFooter({ text: `Requested by ${requestedBy.username}`, iconURL: requestedBy.avatarURL() });
        
        return interaction.followUp({ embeds: [ trackEmbed ] });
    }
}