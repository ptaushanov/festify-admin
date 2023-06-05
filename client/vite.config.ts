import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    esbuild: {
      treeShaking: false
    },
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    preview: {
      host: true,
      port: 4500,
      open: true,
    },
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    build: {
      rollupOptions: {
        treeshake: false,
      },
      outDir: './build'
    }
  })
}