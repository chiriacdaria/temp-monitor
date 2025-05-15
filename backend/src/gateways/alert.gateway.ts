import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@Injectable()
export class AlertsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server = {} as Server;  // Inițializare goală pentru a evita eroarea de TypeScript

  afterInit(server: Server) {
    this.server = server;
    console.log('Gateway initialized');
  }

  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }

  handleAlert(socket: Socket, data: string): string {
    console.log('Alert received:', data);
    return 'Alert received';
  }

  sendAlertMessage(message: string) {
    this.server.emit('alert', message);  // Emiterea unui eveniment către toți clienții
  }
}
