import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // MUI renders through styled-components instead of its default emotion engine.
    alias: { '@mui/styled-engine': '@mui/styled-engine-sc' },
  },
  server: {
    port: 5173,
  },
});
