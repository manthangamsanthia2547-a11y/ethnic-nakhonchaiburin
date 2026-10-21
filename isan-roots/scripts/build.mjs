import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// HERITAGE_DEPS optionally reuses an installed dependency directory locally.
const dependencyRoot = process.env.HERITAGE_DEPS || root;
const require = createRequire(path.join(dependencyRoot, 'package.json'));
const esbuild = require('esbuild');
const tailwind = require('@tailwindcss/node');
const src = path.join(root, 'src');
const files = await fs.readdir(src, { recursive: true });
const sourceFiles = files.filter(file => /\.(tsx?|css)$/.test(file));
const candidates = new Set();
for (const file of sourceFiles.filter(file => /\.tsx?$/.test(file))) {
  const code = await fs.readFile(path.join(src, file), 'utf8');
  // All utility names are complete literals. Tailwind rejects non-class tokens.
  for (const token of code.split(/[\s"'`<>={}(),;]+/)) if (token) candidates.add(token);
}
const css = (await Promise.all(['home.css', 'reference.css', 'ethnic-detail.css', 'restored-home.css', 'activities.css', 'activity-detail.css', 'catalogs.css', 'ethnic-catalog.css'].map(file => fs.readFile(path.join(src, file), 'utf8')))).join('\n');
const compiler = await tailwind.compile(css, {
  base: src,
  onDependency() {},
  customCssResolver: async id => id.startsWith('tailwindcss/') ? require.resolve(id) : undefined,
});
await fs.writeFile(path.join(root, 'home.css'), compiler.build([...candidates]));
// Resolve only explicit project/package files; avoid scanning unrelated parents.
const explicitFiles = {
  name: 'explicit-project-files',
  setup(build) {
    build.onResolve({ filter: /.*/ }, async args => {
      let filename;
      if (path.isAbsolute(args.path)) filename = args.path;
      else if (args.path.startsWith('.')) filename = path.resolve(args.importer ? path.dirname(args.importer) : root, args.path);
      else if (args.path === 'lucide-react') filename = path.join(path.dirname(require.resolve('lucide-react/package.json')), require('lucide-react/package.json').module);
      else filename = require.resolve(args.path);
      for (const candidate of [filename, filename+'.tsx', filename+'.ts', filename+'.js', path.join(filename,'index.tsx'), path.join(filename,'index.js')]) {
        try { if ((await fs.stat(candidate)).isFile()) return { path: candidate, namespace: 'heritage-file' }; } catch {}
      }
      throw new Error(`Cannot resolve ${args.path}`);
    });
    build.onLoad({ filter: /.*/, namespace: 'heritage-file' }, async args => ({
      contents: await fs.readFile(args.path, 'utf8'),
      loader: args.path.endsWith('.tsx') ? 'tsx' : args.path.endsWith('.ts') ? 'ts' : args.path.endsWith('.json') ? 'json' : 'js',
    }));
  },
};
const bundle = await esbuild.build({
  absWorkingDir: root,
  entryPoints: [path.join(src, 'main.tsx')],
  outfile: path.join(root, 'home.bundle.js'),
  bundle: true, format: 'iife', globalName: 'HeritageHome',
  jsx: 'automatic', platform: 'browser', target: ['es2022'], minify: true,
  tsconfigRaw: { compilerOptions: { jsx: 'react-jsx', target: 'ES2022' } },
  nodePaths: [path.join(dependencyRoot, 'node_modules')],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
  plugins: [explicitFiles], write: false,
});
await fs.writeFile(path.join(root, 'home.bundle.js'), bundle.outputFiles[0].contents);
console.log('Built React Home + Tailwind CSS. Existing static routes preserved.');
