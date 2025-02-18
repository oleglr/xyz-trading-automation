import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Removed additionalData since we're using @use
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/v2/sse': {
        target: 'https://pr92.mobile-bot.deriv.dev',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Forward auth headers
            const authHeaders = ['loginid', 'authorize', 'auth-url'];
            authHeaders.forEach(header => {
              const value = req.headers[header];
              if (value) {
                proxyReq.setHeader(header, value);
              }
            });

            // Set SSE headers
            proxyReq.setHeader('Accept', 'text/event-stream');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Connection', 'keep-alive');

            // Log proxy requests for debugging
            console.log('Proxying request:', {
              url: req.url,
              method: req.method,
              headers: proxyReq.getHeaders()
            });
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Proxy response:', {
              url: req.url,
              status: proxyRes.statusCode,
              headers: proxyRes.headers
            });
          });

          proxy.on('error', (err) => {
            console.error('Proxy error:', {
              message: err.message,
              stack: err.stack
            });
          });
        }
      }
    }
  },
})
