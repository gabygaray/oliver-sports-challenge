import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ReportKind } from '../shared/enums';

/** Generated reports, keyed by everything that changes the model output (data included) so a hit is always equivalent. */
@Entity({ name: 'ai_reports' })
@Unique(['kind', 'subjectId', 'language', 'audience', 'promptVersion', 'model', 'contextHash'])
export class AiReport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 30 })
    kind!: ReportKind;

    // Session id or player id, depending on `kind`.
    @Column({ name: 'subject_id', type: 'int' })
    subjectId!: number;

    @Column({ type: 'varchar', length: 2 })
    language!: string;

    @Column({ type: 'varchar', length: 10 })
    audience!: string;

    @Column({ name: 'prompt_version', type: 'varchar', length: 20 })
    promptVersion!: string;

    @Column({ type: 'varchar', length: 80 })
    model!: string;

    // SHA-256 of the context sent to the model; a data change produces a new key.
    @Column({ name: 'context_hash', type: 'char', length: 64 })
    contextHash!: string;

    @Column({ type: 'jsonb' })
    payload!: object;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;
}
