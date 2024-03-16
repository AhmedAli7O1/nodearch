import { ComponentInfo, IComponentDecoratorInfo, IUseProvider } from '@nodearch/core/components';
import { ClassConstructor } from '@nodearch/core/utils';
import http from 'node:http';
import https from 'node:https';
import { ServerOptions } from 'socket.io';
import { SocketIOServerProvider } from './components/server.provider.js';
import * as IO from 'socket.io';
import { SocketIODecorator } from './enums.js';


export interface ISocketIOOptions {
  server?: IServerOptions;
  adapters?: ISocketAppAdapter[];

  // Refer to https://socket.io/docs/v4/server-api/#new-Server-httpServer-options
  ioOptions?: Partial<ServerOptions>;
}

// TODO: add optional IHttpServerProvider { server, status }
export type IServerOptions = {
  port: number;
  hostname?: string;
  https?: https.ServerOptions;
  http?: http.ServerOptions;
};

export type IServerSettings = IServerOptions & {
  port: number;
  hostname: string;
};

export type ISocketAppAdapter = IAdapter | INativeAdapter;

export type IAdapter = {
  getAdapter(getComponent:<T = any>(identifier: any)=> T): INativeAdapter;
};

export type INativeAdapter = (nsp: any) => any;

export type ParentNspNameMatchFn = (name: string, auth: {
  [key: string]: any;
}, fn: (err: Error | null, success: boolean) => void) => void;

export type NamespaceName = string | RegExp | ParentNspNameMatchFn;

export type INamespaceArgs = {};

export type INamespace = IUseProvider<INamespaceArgs, any>;

export type INamespaceOptions = {
  name: NamespaceName;
};

export type ISubscriptionOptions = {
  eventName: string;
}; 

export interface INamespaceInfo {
  name: NamespaceName; 
  events: ISubscriptionInfo[];
  dependenciesKeys: {
    key: string;
    component: ClassConstructor;
  }[];
}

export interface IEventHandlerInput {
  type: (SocketIODecorator.SOCKET_INFO | SocketIODecorator.EVENT_DATA);
  index: number;
}

export interface ISubscriptionInfo {
  eventName: string;
  eventMethod: string;
  eventComponent: ComponentInfo;
  methodInputs: IEventHandlerInput[];
}

export type ISocketIOServerProvider = ClassConstructor<SocketIOServerProvider>;

export type INamespaceMap = Map<ComponentInfo, INamespaceInfo>;

export type IMiddlewareFunction = Parameters<IO.Server['use']>[0];