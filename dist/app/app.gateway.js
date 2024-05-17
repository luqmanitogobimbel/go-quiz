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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const app_service_1 = require("../app.service");
let AppGateway = exports.AppGateway = class AppGateway {
    constructor(appService) {
        this.appService = appService;
    }
    async handleJoinGame(client, { userName, roomId }) {
        const user = await this.appService.createUser(userName);
        client.data.user = user;
        client.join(`room_${roomId}`);
        client.emit('gameJoined', user);
    }
    async handleSubmitAnswer(client, payload) {
        const userId = client.data.user?.id;
        if (!userId) {
            console.error('User ID not found for client:', client.id);
            return;
        }
        const isCorrect = await this.appService.checkAnswer(payload.questionId, payload.answerId);
        if (isCorrect) {
            await this.appService.incrementScore(userId);
        }
        client.emit('answerResult', isCorrect);
    }
    async handleSelectRoom(client, roomId) {
        const rooms = Object.keys(client.rooms).filter((room) => room !== client.id);
        rooms.forEach((room) => client.leave(room));
        client.join(`room_${roomId}`);
        const questions = await this.appService.findRoomQuestions(roomId);
        console.log(questions);
        client.emit('roomQuestions', questions);
    }
    afterInit(server) {
        this.appService.setServer(server);
        console.log('WebSocket initialized');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AppGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('submitAnswer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AppGateway.prototype, "handleSubmitAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('selectRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], AppGateway.prototype, "handleSelectRoom", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map