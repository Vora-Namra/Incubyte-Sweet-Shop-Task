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

  // ---------------- CREATE ----------------
  describe("POST /api/sweets", () => {
    it("should create a sweet successfully", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Lollipop",
          category: "Candy",
          price: 10,
          quantity: 5,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe("Lollipop");
    });

    it("should reject if no token is provided", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .send({ name: "Candy", category: "Sugar", price: 5, quantity: 5 });
      expect(res.status).toBe(401);
    });
  });

  // ---------------- GET ----------------
  describe("GET /api/sweets", () => {
    it("should return all sweets", async () => {
      await Sweet.create({ name: "Barfi", category: "Indian", price: 50, quantity: 15 });
      const res = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app).get("/api/sweets");
      expect(res.status).toBe(401);
    });
  });

  // ---------------- SEARCH ----------------
  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await Sweet.insertMany([
        { name: "Rasgulla", category: "Indian", price: 20, quantity: 10 },
        { name: "Gulab Jamun", category: "Indian", price: 30, quantity: 5 },
        { name: "Cookie", category: "Bakery", price: 15, quantity: 8 },
      ]);
    });

    it("should return sweets by name search", async () => {
      const res = await request(app)
        .get("/api/sweets/search?name=Rasgulla")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe("Rasgulla");
    });

    it("should return sweets within price range", async () => {
      const res = await request(app)
        .get("/api/sweets/search?minPrice=10&maxPrice=25")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.every((s: any) => s.price >= 10 && s.price <= 25)).toBe(true);
    });

    it("should fail with empty query params", async () => {
      const res = await request(app)
        .get("/api/sweets/search")
        .set("Authorization", `Bearer ${userToken}`);
      expect([400, 200]).toContain(res.status); // depending on your controller logic
    });
  });

  // ---------------- UPDATE ----------------
  describe("PUT /api/sweets/:id", () => {
    it("should update sweet successfully", async () => {
      const sweet = await Sweet.create({ name: "Cake", category: "Bakery", price: 100, quantity: 2 });
      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 120 });
      expect(res.status).toBe(200);
      expect(res.body.price).toBe(120);
    });

    it("should return 404 if sweet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ price: 20 });
      expect(res.status).toBe(404);
    });
  });

  // ---------------- DELETE ----------------
  describe("DELETE /api/sweets/:id", () => {
    it("should delete sweet successfully (admin only)", async () => {
      const sweet = await Sweet.create({ name: "Pastry", category: "Bakery", price: 40, quantity: 10 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Deleted");
    });

    it("should forbid delete if user is not admin", async () => {
      const sweet = await Sweet.create({ name: "Pastry", category: "Bakery", price: 40, quantity: 10 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });

  // ---------------- PURCHASE ----------------
  describe("POST /api/sweets/:id/purchase", () => {
    it("should purchase sweet successfully", async () => {
      const sweet = await Sweet.create({ name: "Donut", category: "Bakery", price: 15, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 });
      expect(res.status).toBe(200);
      expect(res.body.sweet.quantity).toBe(3);
    });

    it("should fail if sweet not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 });
      expect(res.status).toBe(404);
    });
  });

  // ---------------- RESTOCK ----------------
  describe("POST /api/sweets/:id/restock", () => {
    it("should restock sweet successfully (admin only)", async () => {
      const sweet = await Sweet.create({ name: "Pie", category: "Bakery", price: 20, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 10 });
      expect(res.status).toBe(200);
      expect(res.body.sweet.quantity).toBe(15);
    });

    it("should forbid restock if not admin", async () => {
      const sweet = await Sweet.create({ name: "Pie", category: "Bakery", price: 20, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ amount: 5 });
      expect(res.status).toBe(403);
    });
  });

  // ---------------- EXTRA EDGE CASES ----------------
  describe("Extra edge cases", () => {
    it("should fail to create sweet if token is invalid", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", "Bearer invalid_token")
        .send({ name: "Candy", category: "Sugar", price: 5, quantity: 5 });
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid token/i);
    });

      it("should ignore non-numeric minPrice gracefully", async () => {
        const res = await request(app)
          .get("/api/sweets/search?minPrice=abc")
          .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    it("should return empty array if no sweets match filter", async () => {
      const res = await request(app)
        .get("/api/sweets/search?name=NonExistentSweet")
        .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });

      it("should fail to update sweet with invalid ObjectId", async () => {
        const res = await request(app)
          .put("/api/sweets/1234invalid")
          .set("Authorization", `Bearer ${userToken}`)
          .send({ price: 50 });
        expect([400, 500]).toContain(res.status);
      });

          
      it("should not allow purchase with quantity = 0", async () => {
        const sweet = await Sweet.create({ name: "Brownie", category: "Bakery", price: 25, quantity: 10 });
        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ quantity: 0 });
        expect(res.status).toBe(400);
        expect(res.body.errors[0].message).toMatch(/must be > 0/i);
      });
  });
});
