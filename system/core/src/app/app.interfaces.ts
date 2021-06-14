import { IClassLoaderOptions } from '../loader';
import { ComponentScope } from '../component';
import {App} from "./app";
import {ClassConstructor} from "../utils";
import { ILogger, ILogOptions } from '../log';
import { IConfigOptions } from '../config/interfaces';


export interface IAppConstructor {
  new(...args: any): App;
}

export interface IAppInfo {
  name: string;
  version: string;
}

export interface IAppOptions {
  appInfo: IAppInfo;
  classLoader: IClassLoaderOptions;
  extensions?: App[];
  defaultScope?: ComponentScope;
  log?: ILogOptions;
  config?: IConfigOptions;
}

export enum RunMode {
  CLI,
  APP,
  EXT
}

export interface IRunApp {
  mode: RunMode.APP;
}

export interface IRunCli {
  mode: RunMode.CLI;
}

export interface IRunExt {
  mode: RunMode.EXT;
  logger: ILogger;  
}

export type IRunOptions = IRunApp | IRunCli | IRunExt;