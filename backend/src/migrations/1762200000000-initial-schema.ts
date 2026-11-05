import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1762200000000 implements MigrationInterface {
    name = 'InitialSchema1762200000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE teams (
                id    INT PRIMARY KEY,
                name  VARCHAR(120) NOT NULL,
                sport VARCHAR(40)  NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE players (
                id           INT PRIMARY KEY,
                team_id      INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                name         VARCHAR(120) NOT NULL,
                position     VARCHAR(3)   NOT NULL,
                shirt_number SMALLINT     NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE sessions (
                id           INT PRIMARY KEY,
                team_id      INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                date         DATE         NOT NULL,
                title        VARCHAR(160) NOT NULL,
                type         VARCHAR(20)  NOT NULL CHECK (type IN ('training', 'match')),
                duration_min SMALLINT     NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE player_sessions (
                id                   SERIAL PRIMARY KEY,
                session_id           INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
                player_id            INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
                minutes_played       SMALLINT      NOT NULL,
                total_distance_m     INT           NOT NULL,
                high_speed_running_m INT           NOT NULL,
                sprints              SMALLINT      NOT NULL,
                max_speed_kmh        NUMERIC(4, 1) NOT NULL,
                accelerations        SMALLINT      NOT NULL,
                rpe                  SMALLINT,
                workload_au          INT,
                CONSTRAINT uq_player_sessions_session_player UNIQUE (session_id, player_id)
            )
        `);
        await queryRunner.query(`CREATE INDEX idx_player_sessions_session ON player_sessions(session_id)`);

        await queryRunner.query(`
            CREATE TABLE metric_thresholds (
                id       SERIAL PRIMARY KEY,
                team_id  INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                metric   VARCHAR(40)    NOT NULL,
                warning  NUMERIC(10, 2) NOT NULL,
                critical NUMERIC(10, 2),
                CONSTRAINT uq_metric_thresholds_team_metric UNIQUE (team_id, metric)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS metric_thresholds`);
        await queryRunner.query(`DROP TABLE IF EXISTS player_sessions`);
        await queryRunner.query(`DROP TABLE IF EXISTS sessions`);
        await queryRunner.query(`DROP TABLE IF EXISTS players`);
        await queryRunner.query(`DROP TABLE IF EXISTS teams`);
    }
}
