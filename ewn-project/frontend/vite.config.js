
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force a single copy of React to prevent "Invalid hook call" errors
      // caused by libraries that bundle their own React
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    // Modern browsers only - drops the legacy/polyfilled JS PageSpeed flags
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep heavy, rarely-co-used libraries in their own chunks
          // so visiting one tool doesn't pull in another tool's library
          pdf: ['pdf-lib', 'pdfjs-dist'],
          docx: ['docx', 'mammoth'],
          'pdf-export': ['jspdf', 'html2canvas'],
          jszip: ['jszip'],
        },
      },
    },
  },
})
 
