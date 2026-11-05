import { Player } from '../../entities/player.entity';
import { PlayerSummary } from './players.types';

export const toPlayerSummary = (player: Player): PlayerSummary => ({
    player_id: player.id,
    player_name: player.name,
    position: player.position,
    shirt_number: player.shirtNumber,
});
