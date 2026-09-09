import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendHost = env.VITE_BACKEND_HOST;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api/v1': {
          target: backendHost,
          changeOrigin: true,
        },
      },
    },
  };
})
