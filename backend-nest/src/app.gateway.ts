import { Role } from 'src/users/enums/role';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth/auth.service';
import {
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


  afterInit(server: Server) {
    this.logger.log('Init');
  }

 
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.removeUserClientAsync(
      client.data.username,
      client.id,
      client.data.role,
      client,
    );
  }

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const payload = await this.authService.verify(
      client.handshake.headers.authorization,
    );

    if (!payload) {
      client.disconnect(true);
      return;
    }
    const { username, role } = payload;
    client.data.username = username;
    client.data.role = role;
    client.data.isAuthenticated = true;
    await this.addUserClientAsync(username, client.id, role, client);
  }

  private async addUserClientAsync(
    username: string,
    socketId: string,
    role: number,
    io: Socket,
  ): Promise<void> {
    let userSocketIdObj: object = JSON.parse(
      await this.redisService.get('userSocketIdObj'),
    );
    if (!userSocketIdObj) {
      userSocketIdObj = {};
    }
    if (!userSocketIdObj.hasOwnProperty(username)) {
      //when user is joining first time
      console.log(socketId);
      userSocketIdObj[username] = new Set([socketId]);
      console.log(JSON.stringify(userSocketIdObj));
      await this.usersService.findOneByUsernameAndUpdateStatus(username, true);

      if (role === Role.PLAYER) {
        console.log('emitted');
        io.emit('refreshPlayerList');
      }
      await this.redisService.set(
        'userSocketIdObj',
        JSON.stringify(userSocketIdObj, (_key, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );
    } else {
      userSocketIdObj[username] = new Set([
        ...userSocketIdObj[username],
        socketId,
      ]);
      await this.redisService.set(
        'userSocketIdObj',
        JSON.stringify(userSocketIdObj, (_key, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );
    }
  }

  private async removeUserClientAsync(
    username: string,
    socketId: string,
    role: number,
    io: Socket,
    event: string = null,
  ) {
    const userSocketIdObj: object = JSON.parse(
      await this.redisService.get('userSocketIdObj'),
    );
    if (userSocketIdObj && userSocketIdObj.hasOwnProperty(username)) {
      userSocketIdObj[username] = new Set(userSocketIdObj[username]);
      let userSocketIdSet = userSocketIdObj[username];
      console.log(
        '🚀 ~ file: app.gateway.ts ~ line 116 ~ userSocketIdSet',
        userSocketIdSet,
      );
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
      await this.redisService.set(
        'userSocketIdObj',
        JSON.stringify(userSocketIdObj, (_key, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );
    }
  }
}
