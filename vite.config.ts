import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import packageJson from './package.json';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
});
