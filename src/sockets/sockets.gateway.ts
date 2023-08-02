import { OnGatewayConnection, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class SocketsGateway implements OnGatewayConnection {
  @WebSocketServer() public server: Server;

  constructor(
    private readonly jwtService: JwtService
  ) { }

  auth(client: Socket) {
    try {
      const authorization = client.handshake.headers['authorization'];
      if (!authorization) throw new WsException('Authorization required!');

      const [, token] = authorization.split(' ');
      const payload = this.jwtService.verify(token);

      return payload;
    } catch {
      console.log('\x1b[31m%s\x1b[0m', `Token invalid. ${client.id}`);
      throw new WsException(`Invalid authorization!`);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const authPayload = this.auth(client);

      client.join(authPayload.id);
      console.log('\x1b[33m%s\x1b[0m', `Client connected: ${client.id} (${authPayload.id})`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('\x1b[33m%s\x1b[0m', `Client disconnected: ${client.id}`);
  }

  async emitVideoStatus(userId: string, videoId: string) {
    this.server.to(userId).emit('completed', { completed: true, id: videoId });
  }

  async emitPaidSeconds(userId: string, paidSeconds: number) {
    this.server.to(userId).emit('paid-seconds', { paidSeconds });
  }
}
