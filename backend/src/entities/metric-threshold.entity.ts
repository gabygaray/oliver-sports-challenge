import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MetricKey } from '../shared/enums';
import { Team } from './team.entity';

const numericToNumber = { to: (v: number | null) => v, from: (v: string | null) => (v === null ? null : Number(v)) };

/** Team reference limits per metric. Exceeding warning or critical raises an alert; critical is optional. */
@Entity({ name: 'metric_thresholds' })
@Unique(['teamId', 'metric'])
export class MetricThreshold {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'team_id', type: 'int' })
    teamId!: number;

    @ManyToOne(() => Team, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team?: Team;

    @Column({ type: 'varchar', length: 40 })
    metric!: MetricKey;

    @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericToNumber })
    warning!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, transformer: numericToNumber })
    critical!: number | null;
}
