module.exports = {
    GetTrackInfo(track) {
        return `[${track.author} - ${track.title}](<${track.url}>)`;
    }
}