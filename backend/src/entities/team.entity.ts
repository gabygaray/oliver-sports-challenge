import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teams' })
export class Team {
    @PrimaryColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar', length: 120 })
    name!: string;

    @Column({ type: 'varchar', length: 40 })
    sport!: string;
}
