import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { Prisma, Chat, question, room } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/chat')
  @Render('index')
  Home(): string {
    return;
  }

  @Get()
  findAll(): Promise<room[]> {
    return this.appService.findAll();
  }

  @Get('rooms')
  findAllRoom(): Promise<room[]> {
    return this.appService.getRoomList();
  }

  @Get(':id/questions')
  getRoomQuestions(@Param('id') id: number): Promise<question[]> {
    return this.appService.findRoomQuestions(id);
  }
}
