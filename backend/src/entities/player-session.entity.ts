import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Player } from './player.entity';
import { Session } from './session.entity';

/** Wearable metrics of one player in one session. rpe is self-reported, so it (and workload) can be missing. */
@Entity({ name: 'player_sessions' })
@Unique(['sessionId', 'playerId'])
export class PlayerSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'session_id', type: 'int' })
    sessionId!: number;

    @ManyToOne(() => Session, (session) => session.playerSessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'session_id' })
    session?: Session;

    @Column({ name: 'player_id', type: 'int' })
    playerId!: number;

    @ManyToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'player_id' })
    player?: Player;

    @Column({ name: 'minutes_played', type: 'smallint' })
    minutesPlayed!: number;

    @Column({ name: 'total_distance_m', type: 'int' })
    totalDistanceM!: number;

    @Column({ name: 'high_speed_running_m', type: 'int' })
    highSpeedRunningM!: number;

    @Column({ type: 'smallint' })
    sprints!: number;

    @Column({ name: 'max_speed_kmh', type: 'numeric', precision: 4, scale: 1, transformer: { to: (v: number) => v, from: (v: string) => Number(v) } })
    maxSpeedKmh!: number;

    @Column({ type: 'smallint' })
    accelerations!: number;

    @Column({ type: 'smallint', nullable: true })
    rpe!: number | null;

    @Column({ name: 'workload_au', type: 'int', nullable: true })
    workloadAu!: number | null;
}
