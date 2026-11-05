import { createApp } from './app';
import { dataSource } from './config/data-source';
import { env } from './config/env';
import { logger } from './config/logger';

const start = async (): Promise<void> => {
    await dataSource.initialize();
    logger.info('Database connection established');

    createApp().listen(env.PORT, () => {
        logger.info(`API listening on http://localhost:${env.PORT}`);
    });
};

start().catch((error) => {
    logger.error(error, 'Failed to start the API');
    process.exit(1);
});
