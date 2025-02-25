import { Track } from "discord-player";

export function GetTrackInfo(track: Track) {
    return `[${track.author} - ${track.title}](<${track.url}>)`;
}