import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private appService: AppService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    client: Socket,
    { userName, roomId }: { userName: string; roomId: number },
  ): Promise<void> {
    const user = await this.appService.createUser(userName);
    client.data.user = user;
    client.join(`room_${roomId}`); // Join the specified room
    client.emit('gameJoined', user);
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    client: Socket,
    payload: { questionId: number; answerId: number },
  ): Promise<void> {
    const userId = client.data.user?.id;
    if (!userId) {
      console.error('User ID not found for client:', client.id);
      return;
    }

    const isCorrect = await this.appService.checkAnswer(
      payload.questionId,
      payload.answerId,
    );
    if (isCorrect) {
      await this.appService.incrementScore(userId);
    }
    client.emit('answerResult', isCorrect);
  }

  @SubscribeMessage('selectRoom')
  async handleSelectRoom(
    client: Socket,
    roomId: { roomId: number },
  ): Promise<void> {
    const rooms = Object.keys(client.rooms).filter(
      (room) => room !== client.id,
    ); // Get all rooms except the default room (client's own room)
    rooms.forEach((room) => client.leave(room)); // Leave all rooms except the default room
    client.join(`room_${roomId}`); // Join the specified room
    const questions = await this.appService.findRoomQuestions(roomId);
    console.log(questions);

    client.emit('roomQuestions', questions);
  }

  afterInit(server: Server) {
    this.appService.setServer(server);
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
