"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const Sweet_1 = __importDefault(require("../src/models/Sweet"));
const generateToken_1 = require("../src/utils/generateToken");
const vitest_1 = require("vitest");
const userToken = (0, generateToken_1.generateToken)({ id: new mongoose_1.default.Types.ObjectId(), isAdmin: false });
const adminToken = (0, generateToken_1.generateToken)({ id: new mongoose_1.default.Types.ObjectId(), isAdmin: true });
(0, vitest_1.describe)("Sweets API", () => {
    (0, vitest_1.beforeAll)(async () => {
        await mongoose_1.default.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/sweetshop");
    });
    (0, vitest_1.afterAll)(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    (0, vitest_1.afterEach)(async () => {
        await Sweet_1.default.deleteMany({});
    });
    (0, vitest_1.describe)("POST /api/sweets", () => {
        (0, vitest_1.it)("should fail if name contains only spaces", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                name: "   ",
                category: "Chocolate",
                price: 10,
                quantity: 5,
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if category contains only spaces", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                name: "Candy",
                category: "   ",
                price: 5,
                quantity: 10,
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if quantity is negative", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                name: "Candy",
                category: "Sugar",
                price: 5,
                quantity: -10,
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if price is string instead of number", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                name: "Candy",
                category: "Sugar",
                price: "five",
                quantity: 10,
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if extra unexpected fields are provided", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/api/sweets")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                name: "Candy",
                category: "Sugar",
                price: 5,
                quantity: 10,
                isAvailable: true,
                randomKey: "hack",
            });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)("PUT /api/sweets/:id", () => {
        (0, vitest_1.it)("should fail if updating with negative price", async () => {
            const sweet = await Sweet_1.default.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/sweets/${sweet._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ price: -5 });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if updating with invalid quantity", async () => {
            const sweet = await Sweet_1.default.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/sweets/${sweet._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ quantity: -10 });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if updating with extra unexpected fields", async () => {
            const sweet = await Sweet_1.default.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/sweets/${sweet._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ price: 5, randomField: "hack" });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)("POST /api/sweets/:id/purchase", () => {
        (0, vitest_1.it)("should fail if quantity exceeds stock", async () => {
            const sweet = await Sweet_1.default.create({ name: "Toffee", category: "Candy", price: 2, quantity: 5 });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ quantity: 10 });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if quantity is not a number", async () => {
            const sweet = await Sweet_1.default.create({ name: "Toffee", category: "Candy", price: 2, quantity: 5 });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ quantity: "three" });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
    (0, vitest_1.describe)("POST /api/sweets/:id/restock", () => {
        (0, vitest_1.it)("should fail if restock amount is string", async () => {
            const sweet = await Sweet_1.default.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${sweet._id}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ amount: "five" });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if restock amount is negative", async () => {
            const sweet = await Sweet_1.default.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${sweet._id}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ amount: -3 });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
        (0, vitest_1.it)("should fail if restock request has extra unexpected fields", async () => {
            const sweet = await Sweet_1.default.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/api/sweets/${sweet._id}/restock`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ amount: 5, randomField: true });
            (0, vitest_1.expect)(res.status).toBe(400);
        });
    });
});
