import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dependencyRoot = process.env.HERITAGE_DEPS || root;
const require = createRequire(path.join(dependencyRoot, 'package.json'));
const { default: react } = await import(pathToFileURL(require.resolve('@vitejs/plugin-react')).href);
const { default: tailwindcss } = await import(pathToFileURL(require.resolve('@tailwindcss/vite')).href);

// Absolute aliases also support the optional local HERITAGE_DEPS dependency cache.
const packages = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'lucide-react', 'tailwindcss/theme.css', 'tailwindcss/utilities.css'];
const resolvePackage = (name: string) => name === 'lucide-react'
  ? path.join(path.dirname(require.resolve('lucide-react/package.json')), require('lucide-react/package.json').module)
  : require.resolve(name);

export default {
  root,
  base: './',
  publicDir: false,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'heritage-static-router-adapter',
      transformIndexHtml: {
        order: 'pre',
        handler(html: string) {
          // The static edition remains directly openable; Vite serves the source edition.
          return html
            .replace(/<link\b[^>]*href=["']home\.css["'][^>]*>/g, '')
            .replace(/<script\b[^>]*src=["'](?:data\.js|home\.bundle\.js|app\.js)["'][^>]*><\/script>/g, '')
            .replace('</head>', '<script type="module" src="/src/vite-entry.ts"></script></head>');
        },
      },
      async closeBundle() {
        const output = path.join(root, 'dist');
        await fs.mkdir(output, { recursive: true });
        // Keep original image URLs and route/data contracts valid in the distribution.
        await Promise.all([
          fs.cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true }),
          ...['app.js', 'data.js'].map(file => fs.copyFile(path.join(root, file), path.join(output, file))),
        ]);
      },
    },
  ],
  resolve: {
    alias: packages.map(name => ({ find: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), replacement: resolvePackage(name) })),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: { allow: [root, dependencyRoot] },
  },
  preview: { host: '127.0.0.1', port: 4174, strictPort: true },
  build: { outDir: 'dist', target: 'es2022', sourcemap: false },
};
