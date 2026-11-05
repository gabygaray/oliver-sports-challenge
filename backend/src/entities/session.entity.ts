import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SessionType } from '../shared/enums';
import { Team } from './team.entity';
import { PlayerSession } from './player-session.entity';

@Entity({ name: 'sessions' })
export class Session {
    @PrimaryColumn({ type: 'int' })
    id!: number;

    @Column({ name: 'team_id', type: 'int' })
    teamId!: number;

    @ManyToOne(() => Team, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @Column({ type: 'date' })
    date!: string;

    @Column({ type: 'varchar', length: 160 })
    title!: string;

    @Column({ type: 'varchar', length: 20 })
    type!: SessionType;

    @Column({ name: 'duration_min', type: 'smallint' })
    durationMin!: number;

    @OneToMany(() => PlayerSession, (playerSession) => playerSession.session)
    playerSessions?: PlayerSession[];
}
