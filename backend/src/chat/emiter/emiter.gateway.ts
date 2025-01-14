import {WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.IP_FRONT,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})export class EmiterGateway {
  @WebSocketServer()
  server: Server;
}
