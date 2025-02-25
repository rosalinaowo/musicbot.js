import { Client, Collection } from "discord.js";
import { Player } from "discord-player";

export interface PlayerClient extends Client {
    player: Player;
    commands: Collection<string, any>;
}