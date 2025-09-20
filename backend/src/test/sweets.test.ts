import request from "supertest";
import app from "../app"; 
import mongoose from "mongoose";
import Sweet from "../models/Sweet";
import { generateToken } from "../utils/generateToken";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

const userToken = generateToken({ id: new mongoose.Types.ObjectId(), isAdmin: false });
const adminToken = generateToken({ id: new mongoose.Types.ObjectId(), isAdmin: true });

describe("Sweets API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  describe("POST /api/sweets", () => {
    it("should fail if name contains only spaces", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "   ",
          category: "Chocolate",
          price: 10,
          quantity: 5,
        });
      expect(res.status).toBe(400);
    });

    it("should fail if category contains only spaces", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Candy",
          category: "   ",
          price: 5,
          quantity: 10,
        });
      expect(res.status).toBe(400);
    });

    it("should fail if quantity is negative", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Candy",
          category: "Sugar",
          price: 5,
          quantity: -10,
        });
      expect(res.status).toBe(400);
    });

    it("should fail if price is string instead of number", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Candy",
          category: "Sugar",
          price: "five",
          quantity: 10,
        });
      expect(res.status).toBe(400);
    });

    it("should fail if extra unexpected fields are provided", async () => {
      const res = await request(app)
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
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/sweets/:id", () => {
    it("should fail if updating with negative price", async () => {
      const sweet = await Sweet.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: -5 });
      expect(res.status).toBe(400);
    });

    it("should fail if updating with invalid quantity", async () => {
      const sweet = await Sweet.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: -10 });
      expect(res.status).toBe(400);
    });

    it("should fail if updating with extra unexpected fields", async () => {
      const sweet = await Sweet.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 5, randomField: "hack" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    it("should fail if quantity exceeds stock", async () => {
      const sweet = await Sweet.create({ name: "Toffee", category: "Candy", price: 2, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 });
      expect(res.status).toBe(400);
    });

    it("should fail if quantity is not a number", async () => {
      const sweet = await Sweet.create({ name: "Toffee", category: "Candy", price: 2, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: "three" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    it("should fail if restock amount is string", async () => {
      const sweet = await Sweet.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: "five" });
      expect(res.status).toBe(400);
    });

    it("should fail if restock amount is negative", async () => {
      const sweet = await Sweet.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: -3 });
      expect(res.status).toBe(400);
    });

    it("should fail if restock request has extra unexpected fields", async () => {
      const sweet = await Sweet.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 5, randomField: true });
      expect(res.status).toBe(400);
    });
  });
});
