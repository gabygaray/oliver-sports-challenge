import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/test/**/*.test.ts'],
        environment: 'node',
        // The .snap sits next to its test instead of in a __snapshots__ folder.
        resolveSnapshotPath: (testPath, extension) => testPath.replace(/\.test\.ts$/, extension),
    },
});
