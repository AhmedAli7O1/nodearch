import { IExtensionProvider, Service } from '@nodearch/core';
import { SocketService } from './socket.service.js';
import * as IO from 'socket.io';


@Service({ export: true })
export class SocketIOServerProvider implements IExtensionProvider {
  constructor(
    private readonly socketService: SocketService
  ) {}

  get(): IO.Server {
    return this.socketService.getServer();
  }
}