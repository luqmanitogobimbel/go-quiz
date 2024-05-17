import { Prisma, Chat, question, room } from '@prisma/client';
import { Server } from 'socket.io';
import { PrismaService } from './prisma.service';
export declare class AppService {
    private prisma;
    private server;
    private currentQuestionIndex;
    private questions;
    private questionInterval;
    constructor(prisma: PrismaService);
    setServer(server: Server): void;
    private loadQuestions;
    private startQuestionTimer;
    private sendQuestion;
    private showLeaderboard;
    createMessage(data: Prisma.ChatCreateInput): Promise<Chat>;
    getMessages(): Promise<Chat[]>;
    findAll(): Promise<room[]>;
    getRoomList(): Promise<room[]>;
    findRoomQuestions(roomId: any): Promise<question[]>;
    createUser(name: string): Promise<any>;
    checkAnswer(questionId: number, answerId: number): Promise<boolean>;
    incrementScore(userId: number): Promise<void>;
    getLeaderboard(): Promise<any>;
}
