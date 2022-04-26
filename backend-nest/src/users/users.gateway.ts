import { Socket, Server } from 'socket.io';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/mysocket',
})
export class UsersGateway {
  @WebSocketServer() server: Server;
  
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, payload: string): void {
    
    client.emit('message', "adu vip qua");
  }
}
