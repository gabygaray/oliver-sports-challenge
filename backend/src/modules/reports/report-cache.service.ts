import { findCachedReport, saveCachedReport } from './report-cache.repository';
import { ReportCacheKey, ReportMeta, ReportProgress } from './reports.types';

/** Serves the stored report for an identical request (same data included) unless `force` asks for a fresh one, which then replaces it. */
export const resolveReport = async <T extends { meta: ReportMeta }>(
    key: ReportCacheKey,
    force: boolean,
    progress: ReportProgress,
    generate: () => Promise<T>,
): Promise<T> => {
    if (!force) {
        const cached = await findCachedReport<T>(key);
        if (cached) {
            progress.onStage?.('cached');
            return { ...cached, meta: { ...cached.meta, cached: true } };
        }
    }

    progress.onStage?.('generating');
    const report = await generate();
    await saveCachedReport(key, report);
    return report;
};
