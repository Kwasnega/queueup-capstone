
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Get all HTML files from the root directory
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Use login.html as the main entry point instead of index.html
        login: resolve(__dirname, 'login.html'),
        // Add all other HTML files as entry points
        ...Object.fromEntries(
          htmlFiles
            .filter(file => file !== 'login.html') // Skip login.html since we already added it
            .map(file => [file.replace('.html', ''), resolve(__dirname, file)])
        )
      }
    }
  }
});
