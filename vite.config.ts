import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@services': resolve(__dirname, 'src/services'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
