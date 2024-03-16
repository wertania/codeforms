import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@services': resolve(__dirname, 'src/services'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
