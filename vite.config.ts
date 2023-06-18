import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@consts', replacement: path.resolve(__dirname, './src/consts') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
      { find: '@services', replacement: path.resolve(__dirname, './src/services') },
      { find: '@themes', replacement: path.resolve(__dirname, './src/themes') },
      { find: '@types', replacement: path.resolve(__dirname, './src/types') },
      { find: '@views', replacement: path.resolve(__dirname, './src/views') },
    ],
  }
})
