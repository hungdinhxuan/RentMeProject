import { AuthService } from './auth/auth.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Socket, Server } from 'socket.io';

 
 @WebSocketGateway({
   cors: {
     origin: '*',
   },
   path: '/mysocket',
   
 })

 
 export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(private readonly authService: AuthService){

  }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
 
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
   this.server.emit('msgToClient', payload);
  }
 
  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
 
  async handleConnection(client: Socket, ...args: any[]) {
   this.logger.log(`Client connected: ${client.id}`);
   const payload = await this.authService.verify(
    client.handshake.headers.authorization,
   );
    if(!payload){
      client.disconnect(true);
    }
    
  }
 }