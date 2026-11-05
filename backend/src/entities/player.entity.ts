import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity({ name: 'players' })
export class Player {
    @PrimaryColumn({ type: 'int' })
    id!: number;

    @Column({ name: 'team_id', type: 'int' })
    teamId!: number;

    @ManyToOne(() => Team, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @Column({ type: 'varchar', length: 120 })
    name!: string;

    @Column({ type: 'varchar', length: 3 })
    position!: string;

    @Column({ name: 'shirt_number', type: 'smallint' })
    shirtNumber!: number;
}
