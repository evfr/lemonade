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
const WebhookService_1 = __importDefault(require("../services/WebhookService"));
class WebhookController {
    constructor() {
        this.createWebhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { hours, minutes, seconds, url } = req.body;
                if (typeof hours !== 'number' || typeof minutes !== 'number' || typeof seconds !== 'number' || typeof url !== 'string') {
                    res.status(400).json({ error: 'Invalid input. Please provide hours, minutes, seconds, and a valid URL.' });
                }
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                const newWebhook = yield this.webhookService.createWebhook(url, totalSeconds);
                res.json({ id: newWebhook === null || newWebhook === void 0 ? void 0 : newWebhook.id, timeLeft: newWebhook === null || newWebhook === void 0 ? void 0 : newWebhook.timeLeft });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.handleOverdueWebhooks = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.webhookService.handleOverdueWebhooks();
            }
            catch (error) {
                console.error(error);
            }
        });
        this.getWebhookById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const webhookId = parseInt(req.params.id);
                const webhook = yield this.webhookService.getWebhookById(webhookId);
                if (!webhook) {
                    res.status(404).json({ error: 'Webhook not found' });
                    return;
                }
                const now = new Date();
                const secLeft = Math.round((webhook.createdAt.getTime() + webhook.timeLeft * 1000 - now.getTime()) / 1000);
                res.json({ id: webhook === null || webhook === void 0 ? void 0 : webhook.id, timeLeft: secLeft });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        // this emdpoint 
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const webhookId = parseInt(req.params.id);
            res.json(webhookId);
            console.log('Check', webhookId);
        });
        this.webhookService = new WebhookService_1.default();
    }
}
exports.default = WebhookController;
//# sourceMappingURL=WebhookController.js.map