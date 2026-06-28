
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
        manualChunks(id) {
          // Keep heavy, rarely-co-used libraries in their own chunks
          // so visiting one tool doesn't pull in another tool's library
          if (id.includes('node_modules')) {
            if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) return 'pdf';
            if (id.includes('docx') || id.includes('mammoth')) return 'docx';
            if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf-export';
            if (id.includes('jszip')) return 'jszip';
          }
        },
      },
    },
  },
})
 
