import { Role } from 'src/users/enums/role';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth/auth.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { RedisService } from './redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/mysocket',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}
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

  async handleConnection(@ConnectedSocket()  client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const payload = await this.authService.verify(
      client.handshake.headers.authorization,
    );
    if (!payload) {
      client.disconnect(true);
      client.data.username =  payload.username;
    }
  }

  private async addUserClientAsync(
    username: string,
    socketId: string,
    role: number,
    io: any,
  ): Promise<void> {
    const userSocketIdObj: object = JSON.parse(
      await this.redisService.get('userSocketIdObj'),
    );
    if (!userSocketIdObj.hasOwnProperty(username)) {
      userSocketIdObj[role] = socketId;
      //when user is joining first time
      userSocketIdObj[username] = new Set([socketId]);
      await this.usersService.findOneByUsernameAndUpdateStatus(username, true);
      this.logger.verbose(`${username} is online with role ${role}`);
      if (role === Role.PLAYER) {
        console.log('emitted');
        io.emit('refreshPlayerList');
      } else {
        userSocketIdObj[username].add(socketId);
      }
      await this.redisService.set(
        'userSocketIdObj',
        JSON.stringify(userSocketIdObj),
      );
    }
  }

  private async removeUserClientAsync(
    username: string,
    socketId: string,
    role: number,
    io: any,
    event: string = null,
  ) {
    const userSocketIdObj: object = JSON.parse(
      await this.redisService.get('userSocketIdObj'),
    );
    if (userSocketIdObj.hasOwnProperty(username)) {
      let userSocketIdSet = userSocketIdObj[username];
      userSocketIdSet.delete(socketId);
      //if there are no clients for a user, remove that user from online list(Obj) and set status to offline;
      if (userSocketIdSet.size == 0) {
        delete userSocketIdObj[username];
        try {
          await this.usersService.findOneByUsernameAndUpdateStatus(
            username,
            false,
          );

          if (role === Role.PLAYER) {
            // Notify to client to load player list
            this.logger.log('emit disconnected');
            io.emit('refreshPlayerList');
          }
          this.logger.log(`${username} is offline`);
        } catch (error) {
          this.logger.error(error);
        }
      } else {
        if (event === 'logout') {
          delete userSocketIdObj[username];
          try {
            await this.usersService.findOneByUsernameAndUpdateStatus(
              username,
              false,
            );
            if (role === Role.PLAYER) {
              // Notify to client to load player list
              this.logger.log('emit disconnected');
              io.emit('refreshPlayerList');
            }
            this.logger.log(`${username} is offline`);
          } catch (error) {
            this.logger.error(error);
          }
        }
      }
    }
  }
}
