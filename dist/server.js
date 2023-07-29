"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WebhookController_1 = __importDefault(require("./controllers/WebhookController"));
const DbService_1 = __importDefault(require("./services/DbService"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    configureRoutes() {
        const webhookController = new WebhookController_1.default();
        this.app.post('/timers', webhookController.createWebhook);
        this.app.get('/timers/:id', webhookController.getWebhookById);
        //for my tests
        this.app.post('/test/:id', webhookController.test);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookController = new WebhookController_1.default();
            yield DbService_1.default.getDb();
            this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`);
            });
            yield webhookController.handleOverdueWebhooks();
        });
    }
}
const port = 3000;
const server = new Server(port);
server.start();
//# sourceMappingURL=server.js.map