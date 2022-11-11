import path from 'path';
import { Service } from '@nodearch/core';
import { IAppConfig, IAppInfo } from './app.interfaces';
import { Loading } from '../loading.service';


@Service()
export class AppService {

  appInfo?: IAppInfo;

  constructor(
    private readonly loading: Loading
  ) {}

  getCommands() {
    if (this.appInfo) {
      // TODO: return commands
    }
  }

  async load() {
    this.loading.start('Scanning for a local App...');
    
    const appConfig = await this.getAppConfig();

    if (!appConfig) return;

    const LocalApp = (await this.importIfExist(appConfig.path))?.default;
    
    if (!LocalApp.nodearch) return;

    this.appInfo = {
      paths: {
        root: this.resolvePath(process.cwd()),
        nodeModules: this.resolvePath(path.join(process.cwd(), 'node_modules')),
        app: appConfig.path
      },
      app: new LocalApp()
    };

    this.loading.stop();
  }

  private async getAppConfig() {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = await this.importIfExist(pkgPath); 
    
    if (pkg && pkg.nodearch && pkg.nodearch.path) {
      pkg.nodearch.path = this.resolvePath(pkg.nodearch.path);
      return pkg.nodearch as IAppConfig;
    }
  }

  private async importIfExist(path: string) {
    try {
      return await import(path);
    }
    catch(e: any) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }

  private resolvePath(strPath: string) {
    return (path.isAbsolute(strPath) ? 
      path.normalize(strPath) : path.resolve(strPath)).replace(/\\/g, '/');
  }
}