import { dataSource } from '../../config/data-source';
import { Player } from '../../entities/player.entity';
import { PlayerSession } from '../../entities/player-session.entity';

export const findAllPlayers = (): Promise<Player[]> => dataSource.getRepository(Player).find({ order: { shirtNumber: 'ASC' } });

export const findPlayerById = (id: number): Promise<Player | null> => dataSource.getRepository(Player).findOneBy({ id });

/** Every session the player took part in, oldest first, with the session loaded for dates and durations. */
export const findPlayerSessions = (playerId: number): Promise<PlayerSession[]> =>
    dataSource
        .getRepository(PlayerSession)
        .createQueryBuilder('ps')
        .innerJoinAndSelect('ps.session', 'session')
        .innerJoinAndSelect('ps.player', 'player')
        .where('ps.player_id = :playerId', { playerId })
        .orderBy('session.date', 'ASC')
        .addOrderBy('session.id', 'ASC')
        .getMany();
