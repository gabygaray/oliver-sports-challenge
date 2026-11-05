import { dataSource } from '../../config/data-source';
import { AiReport } from '../../entities/ai-report.entity';
import { ReportCacheKey } from './reports.types';

export const findCachedReport = async <T>(key: ReportCacheKey): Promise<T | null> => {
    const row = await dataSource.getRepository(AiReport).findOneBy(key);
    return row ? (row.payload as T) : null;
};

/** Upsert so a forced regeneration replaces the previous payload instead of failing on the unique key. */
export const saveCachedReport = async (key: ReportCacheKey, payload: object): Promise<void> => {
    await dataSource
        .getRepository(AiReport)
        .upsert({ ...key, payload }, ['kind', 'subjectId', 'language', 'audience', 'promptVersion', 'model', 'contextHash']);
};
