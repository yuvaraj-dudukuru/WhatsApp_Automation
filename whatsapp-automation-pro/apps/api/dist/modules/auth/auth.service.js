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
exports.authService = void 0;
const database_1 = require("../../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name } = data;
            const existingUser = yield database_1.prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield database_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });
            const token = this.generateToken(user.id);
            return { user: { id: user.id, email: user.email, name: user.name }, token };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield database_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const validPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid credentials');
            }
            const token = this.generateToken(user.id);
            return { user: { id: user.id, email: user.email, name: user.name }, token };
        });
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}
exports.authService = new AuthService();
