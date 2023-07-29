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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class DbService {
    constructor() {
        this.uri = 'mongodb+srv://evfisher:evfisher@cluster-2023.wpjvtmg.mongodb.net/1st?retryWrites=true&w=majority';
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (DbService.connection) {
                return DbService.connection;
            }
            const dbService = new DbService();
            DbService.connection = dbService.connect();
            return DbService.connection;
        });
    }
    static getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield DbService.getConnection();
            const db = connection.db('1st');
            return db;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbClient = new mongodb_1.MongoClient(this.uri);
            yield dbClient.connect();
            return dbClient;
        });
    }
}
exports.default = DbService;
//# sourceMappingURL=DbService.js.map