// test/sweets.test.ts
import request from "supertest";
import app from "../src/app"; // adjust path to your Express app
import mongoose from "mongoose";
import Sweet from "../src/models/Sweet";
import { generateToken } from "../src/utils/generateToken";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

// Utility helpers
const userToken = generateToken({ id: new mongoose.Types.ObjectId(), isAdmin: false });
const adminToken = generateToken({ id: new mongoose.Types.ObjectId(), isAdmin: true });

describe("Sweets API", () => {
  beforeAll(async () => {
    // connect to test DB
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/sweetshop-test");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  // -------------------------
  // POST /api/sweets
  // -------------------------
  describe("POST /api/sweets", () => {
    it("should create a new sweet with valid data", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Chocolate Bar",
          category: "Chocolate",
          price: 10,
          quantity: 50,
        });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Chocolate Bar");
    });

    it("should fail if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it("should fail if price is negative", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Candy",
          category: "Sugar",
          price: -5,
          quantity: 10,
        });
      expect(res.status).toBe(400);
    });
  });

  // -------------------------
  // GET /api/sweets
  // -------------------------
  describe("GET /api/sweets", () => {
    it("should return a list of sweets", async () => {
      await Sweet.create({ name: "Lollipop", category: "Candy", price: 2, quantity: 100 });
      const res = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // -------------------------
  // GET /api/sweets/search
  // -------------------------
  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await Sweet.insertMany([
        { name: "Caramel Candy", category: "Candy", price: 5, quantity: 20 },
        { name: "Dark Chocolate", category: "Chocolate", price: 15, quantity: 30 },
      ]);
    });

    it("should search sweets by name", async () => {
      const res = await request(app)
        .get("/api/sweets/search?name=caramel")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body[0].name).toContain("Caramel");
    });

    it("should search sweets by category", async () => {
      const res = await request(app)
        .get("/api/sweets/search?category=Chocolate")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body[0].category).toBe("Chocolate");
    });

    it("should fail if no filters are provided", async () => {
      const res = await request(app)
        .get("/api/sweets/search")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(400);
    });
  });

  // -------------------------
  // PUT /api/sweets/:id
  // -------------------------
  describe("PUT /api/sweets/:id", () => {
    it("should update an existing sweet", async () => {
      const sweet = await Sweet.create({ name: "Mint", category: "Candy", price: 3, quantity: 20 });
      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 5 });
      expect(res.status).toBe(200);
      expect(res.body.price).toBe(5);
    });

    it("should return 404 if sweet not found", async () => {
      const res = await request(app)
        .put(`/api/sweets/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 10 });
      expect(res.status).toBe(404);
    });
  });

  // -------------------------
  // DELETE /api/sweets/:id
  // -------------------------
  describe("DELETE /api/sweets/:id", () => {
    it("should delete a sweet as admin", async () => {
      const sweet = await Sweet.create({ name: "Jelly", category: "Candy", price: 4, quantity: 25 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("should forbid deletion if not admin", async () => {
      const sweet = await Sweet.create({ name: "Jelly", category: "Candy", price: 4, quantity: 25 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });

  // -------------------------
  // POST /api/sweets/:id/purchase
  // -------------------------
  describe("POST /api/sweets/:id/purchase", () => {
    it("should purchase a sweet and decrease stock", async () => {
      const sweet = await Sweet.create({ name: "Toffee", category: "Candy", price: 2, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 3 });
      expect(res.status).toBe(200);
      expect(res.body.sweet.quantity).toBe(7);
    });

    it("should fail if purchase quantity <= 0", async () => {
      const sweet = await Sweet.create({ name: "Candy", category: "Sugar", price: 2, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 0 });
      expect(res.status).toBe(400);
    });

    it("should fail if sweet not found", async () => {
      const res = await request(app)
        .post(`/api/sweets/${new mongoose.Types.ObjectId()}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 });
      expect(res.status).toBe(404);
    });
  });

  // -------------------------
  // POST /api/sweets/:id/restock
  // -------------------------
  describe("POST /api/sweets/:id/restock", () => {
    it("should restock a sweet as admin", async () => {
      const sweet = await Sweet.create({ name: "Cookie", category: "Bakery", price: 5, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 5 });
      expect(res.status).toBe(200);
      expect(res.body.sweet.quantity).toBe(15);
    });

    it("should fail if restock amount <= 0", async () => {
      const sweet = await Sweet.create({ name: "Brownie", category: "Bakery", price: 8, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 0 });
      expect(res.status).toBe(400);
    });

    it("should forbid restock if not admin", async () => {
      const sweet = await Sweet.create({ name: "Brownie", category: "Bakery", price: 8, quantity: 10 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ amount: 5 });
      expect(res.status).toBe(403);
    });
  });
});
