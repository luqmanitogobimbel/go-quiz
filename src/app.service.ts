import { Injectable } from '@nestjs/common';
import { Prisma, Chat, question, room } from '@prisma/client';
import { Server } from 'socket.io';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private server: Server;
  private currentQuestionIndex = 0;
  private questions: question[] = [];
  private questionInterval: NodeJS.Timeout;

  constructor(private prisma: PrismaService) {
    this.loadQuestions();
  }

  setServer(server: Server) {
    this.server = server;
    this.startQuestionTimer();
  }

  private async loadQuestions() {
    this.questions = await this.prisma.question.findMany({
      include: { answers: true },
    });
    this.startQuestionTimer();
  }

  private startQuestionTimer() {
    if (this.questions.length === 0) {
      console.error('No questions loaded');
      return;
    }
    this.sendQuestion();
    this.questionInterval = setInterval(() => {
      this.showLeaderboard();
      setTimeout(() => {
        this.currentQuestionIndex =
          (this.currentQuestionIndex + 1) % this.questions.length;
        this.sendQuestion();
      }, 5000);
    }, 15000);
  }

  private sendQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    this.server.emit('question', question);
  }

  private async showLeaderboard() {
    const leaderboard = await this.getLeaderboard();
    this.server.emit('leaderboard', leaderboard);
  }

  async createMessage(data: Prisma.ChatCreateInput): Promise<Chat> {
    return await this.prisma.chat.create({ data });
  }

  async getMessages(): Promise<Chat[]> {
    return await this.prisma.chat.findMany();
  }

  async findAll(): Promise<room[]> {
    return this.prisma.room.findMany();
  }

  async getRoomList(): Promise<room[]> {
    return this.prisma.room.findMany();
  }

  async findRoomQuestions(roomId: any): Promise<question[]> {
    const num = Number(roomId);
    return this.prisma.question.findMany({
      where: {
        roomId: num,
      },
      include :{
        answers : true
      }
    });
  }

  async createUser(name: string) {
    return this.prisma.user.create({ data: { name } });
  }

  async checkAnswer(questionId: number, answerId: number): Promise<boolean> {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    return answer?.isCorrect || false;
  }

  async incrementScore(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { score: { increment: 1 } },
    });
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      orderBy: { score: 'desc' },
      take: 10,
    });
  }
}
