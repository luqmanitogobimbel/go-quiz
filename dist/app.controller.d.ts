import { question, room } from '@prisma/client';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Home(): string;
    findAll(): Promise<room[]>;
    findAllRoom(): Promise<room[]>;
    getRoomQuestions(id: number): Promise<question[]>;
}
