import { MigrationInterface, QueryRunner } from 'typeorm';

export class AiReports1762300000000 implements MigrationInterface {
    name = 'AiReports1762300000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE ai_reports (
                id SERIAL PRIMARY KEY,
                kind VARCHAR(30) NOT NULL,
                subject_id INT NOT NULL,
                language VARCHAR(2) NOT NULL,
                audience VARCHAR(10) NOT NULL,
                prompt_version VARCHAR(20) NOT NULL,
                model VARCHAR(80) NOT NULL,
                context_hash CHAR(64) NOT NULL,
                payload JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_ai_reports_key UNIQUE (kind, subject_id, language, audience, prompt_version, model, context_hash)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE ai_reports');
    }
}
