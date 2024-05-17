"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let AppService = exports.AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.loadQuestions();
    }
    setServer(server) {
        this.server = server;
        this.startQuestionTimer();
    }
    async loadQuestions() {
        this.questions = await this.prisma.question.findMany({
            include: { answers: true },
        });
        this.startQuestionTimer();
    }
    startQuestionTimer() {
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
    sendQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.server.emit('question', question);
    }
    async showLeaderboard() {
        const leaderboard = await this.getLeaderboard();
        this.server.emit('leaderboard', leaderboard);
    }
    async createMessage(data) {
        return await this.prisma.chat.create({ data });
    }
    async getMessages() {
        return await this.prisma.chat.findMany();
    }
    async findAll() {
        return this.prisma.room.findMany();
    }
    async getRoomList() {
        return this.prisma.room.findMany();
    }
    async findRoomQuestions(roomId) {
        const num = Number(roomId);
        return this.prisma.question.findMany({
            where: {
                roomId: num,
            },
            include: {
                answers: true
            }
        });
    }
    async createUser(name) {
        return this.prisma.user.create({ data: { name } });
    }
    async checkAnswer(questionId, answerId) {
        const answer = await this.prisma.answer.findUnique({
            where: { id: answerId },
        });
        return answer?.isCorrect || false;
    }
    async incrementScore(userId) {
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
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map