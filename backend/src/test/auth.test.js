"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
const User_1 = __importDefault(require("../src/models/User"));
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop';
(0, vitest_1.beforeAll)(async () => {
    await mongoose_1.default.connect(MONGO_URI);
    await User_1.default.deleteMany({});
});
(0, vitest_1.afterAll)(async () => {
    await mongoose_1.default.connection.close();
});
(0, vitest_1.beforeEach)(async () => {
    await User_1.default.deleteMany({});
    await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
    });
});
(0, vitest_1.describe)('Auth API', () => {
    (0, vitest_1.describe)('POST /api/auth/register', () => {
        (0, vitest_1.test)('should fail if required fields are missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({});
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if email is invalid', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'Test',
                email: 'not-an-email',
                password: '123456',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password is too short', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'ShortPass',
                email: 'shortpass@example.com',
                password: '123',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if name is empty string', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: '',
                email: 'emptyname@example.com',
                password: 'password123',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if name contains only spaces', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: '   ',
                email: 'spacesonly@example.com',
                password: 'password123'
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password contains only spaces', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'SpacePass',
                email: 'spacepass@example.com',
                password: '      '
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if request body contains unexpected fields', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'Extra Fields',
                email: 'extrafields@example.com',
                password: 'password123',
                role: 'admin',
                randomKey: 'hack',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should register successfully with valid data', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123',
            });
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body).toHaveProperty('token');
        });
        (0, vitest_1.test)('should fail if email already exists', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password123',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)('POST /api/auth/login', () => {
        (0, vitest_1.test)('should fail if email is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ password: 'password123' });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password is missing', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'test@example.com' });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if email format is invalid', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'not-an-email',
                password: 'password123',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password is empty string', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: '',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if credentials are invalid', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should login successfully with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'password123',
            });
            (0, vitest_1.expect)(res.status).toBe(200); // ✅ success status
            (0, vitest_1.expect)(res.body).toHaveProperty('token');
        });
        (0, vitest_1.test)('should fail if too many failed attempts (brute-force)', async () => {
            for (let i = 0; i < 5; i++) {
                await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });
            }
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            (0, vitest_1.expect)([400, 429]).toContain(res.status);
        });
        (0, vitest_1.test)('should fail if email is correct but case sensitivity not handled', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'TEST@EXAMPLE.COM',
                password: 'password123'
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password contains SQL injection attempt', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: "' OR '1'='1"
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if login request includes extra unexpected fields', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'password123',
                isAdmin: true,
                debug: true
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if email is missing "@"', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'testexample.com',
                password: 'password123'
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if email is empty string', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: '',
                password: 'password123'
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.test)('should fail if password is extremely long (>200 chars)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'x'.repeat(201)
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
});
