import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dependencyRoot = process.env.HERITAGE_DEPS || root;
const require = createRequire(path.join(dependencyRoot, 'package.json'));
const vite = await import(pathToFileURL(require.resolve('vite')).href);
const config = {
  root,
  configFile: path.join(root, 'vite.config.mts'),
  configLoader: 'native',
};

const command = process.argv[2] || 'build';
if (command === 'dev') {
  const server = await vite.createServer(config);
  await server.listen();
  server.printUrls();
} else if (command === 'preview') {
  const server = await vite.preview(config);
  server.printUrls();
} else if (command === 'build') {
  await vite.build(config);
} else {
  throw new Error(`Unknown command: ${command}. Use dev, build, or preview.`);
}
