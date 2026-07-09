import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({

  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@/components/ui/financial-amount': path.resolve(__dirname, './src/features/financial/shared/components/financial-amount'),
      '@/components/ui/status-badge': path.resolve(__dirname, './src/features/contracts/components/status-badge'),
      '@/components/ui/state-badge': path.resolve(__dirname, './src/features/contracts/components/state-badge'),
      '@/components/ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@/lib/utils': path.resolve(__dirname, './src/shared/lib/utils'),
      '@/lib/formatters': path.resolve(__dirname, './src/shared/lib/formatters'),
      '@/lib': path.resolve(__dirname, './src/shared/lib'),
      '@/types': path.resolve(__dirname, './src/shared/types/index.ts'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/providers': path.resolve(__dirname, './src/providers'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
