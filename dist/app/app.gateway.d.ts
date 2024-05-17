import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private appService;
    server: Server;
    constructor(appService: AppService);
    handleJoinGame(client: Socket, { userName, roomId }: {
        userName: string;
        roomId: number;
    }): Promise<void>;
    handleSubmitAnswer(client: Socket, payload: {
        questionId: number;
        answerId: number;
    }): Promise<void>;
    handleSelectRoom(client: Socket, roomId: {
        roomId: number;
    }): Promise<void>;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
