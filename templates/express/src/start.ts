import path from 'path';
import MainApp from './main';

async function main() {
  const app = new MainApp();
  await app.init({
    mode: 'app',
    appInfo: path.join(__dirname, '..', 'package.json')
  });
  await app.start();
}

main().catch(console.log);