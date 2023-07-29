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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbService_1 = __importDefault(require("./DbService"));
const axios_1 = __importDefault(require("axios"));
class WebhookService {
    constructor() {
        this.tasks = new Map();
    }
    handleOverdueWebhooks() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield DbService_1.default.getDb();
            const lateWebhooks = this.db.collection("webhooks").aggregate([
                {
                    $addFields: {
                        "newDateField": {
                            $add: ["$createdAt", { $multiply: ["$timeLeft", 1000] }]
                        }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $lt: ["$newDateField", new Date()]
                        }
                    }
                }
            ]).toArray();
            try {
                for (var _d = true, _e = __asyncValues(yield lateWebhooks), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const wh = _c;
                    this.fireWebhookAndDeleteTimer(wh.id, wh.url);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log(`Handled ${(yield lateWebhooks).length} late Webhooks`);
        });
    }
    getWebhookById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield DbService_1.default.getDb();
            const dbWebhook = yield this.db.collection("webhooks").findOne({ id: id });
            if (dbWebhook) {
                const webhook = {
                    id: dbWebhook.id,
                    url: dbWebhook.url,
                    timeLeft: dbWebhook.timeLeft,
                    createdAt: dbWebhook.createdAt
                };
                return webhook;
            }
            return null;
        });
    }
    createWebhook(url, totalSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const random = Math.floor(Math.random() * 10000) + 1;
            this.db = yield DbService_1.default.getDb();
            const newWebhook = { id: random, url, timeLeft: totalSeconds, createdAt: new Date() };
            yield this.db.collection("webhooks").insertOne(newWebhook);
            const myTimer = setTimeout(() => this.fireWebhookAndDeleteTimer(newWebhook.id, newWebhook.url), totalSeconds * 1000);
            this.tasks.set(newWebhook.id, myTimer);
            return newWebhook;
        });
    }
    fireWebhookAndDeleteTimer(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.db = yield DbService_1.default.getDb();
                const currUrl = url.endsWith('/') ? `${url}${id}` : `${url}/${id}`;
                yield axios_1.default.post(currUrl, {});
                console.log(`Webhook ${id} fired`);
                yield this.db.collection('webhooks').deleteOne({ id });
                console.log(`Webhook ${id} deleted from DB`);
                if (this.tasks.get(id))
                    clearTimeout(this.tasks.get(id));
                console.log(`Task ${id} deleted`);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = WebhookService;
//# sourceMappingURL=WebhookService.js.map