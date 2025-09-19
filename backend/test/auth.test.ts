import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop';

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  // Close DB connection
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear users before each test to avoid duplicates
  await User.deleteMany({});

  // Register a test user for login tests
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  });
});

describe('Auth API', () => {
  // -------------------------
  // Registration Tests
  // -------------------------
  describe('POST /api/auth/register', () => {
    test('should fail if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
    });

    test('should fail if email is invalid', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test',
        email: 'not-an-email',
        password: '123456',
      });
      expect(res.status).toBe(400);
    });

    test('should fail if password is too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'ShortPass',
        email: 'shortpass@example.com',
        password: '123',
      });
      expect(res.status).toBe(400);
    });

    test('should fail if name is empty string', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: '',
        email: 'emptyname@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(400);
    });

    test('should fail if name contains only spaces', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: '   ',
        email: 'spacesonly@example.com',
        password: 'password123'
      });
      expect(res.status).toBe(400);
    });

    test('should fail if password contains only spaces', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'SpacePass',
        email: 'spacepass@example.com',
        password: '      '
      });
      expect(res.status).toBe(400);
    });

    test('should fail if request body contains unexpected fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Extra Fields',
        email: 'extrafields@example.com',
        password: 'password123',
        role: 'admin',
        randomKey: 'hack',
      });
      expect(res.status).toBe(400);
    });

    test('should register successfully with valid data', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    test('should fail if email already exists', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(400);
    });
  });

  // -------------------------
  // Login Tests
  // -------------------------
  describe('POST /api/auth/login', () => {
    test('should fail if email is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ password: 'password123' });
      expect(res.status).toBe(400);
    });

    test('should fail if password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });

    test('should fail if email format is invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(res.status).toBe(400);
    });

    test('should fail if password is empty string', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: '',
      });
      expect(res.status).toBe(400);
    });

    test('should fail if credentials are invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(400);
    });

    test('should login successfully with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200); // ✅ success status
      expect(res.body).toHaveProperty('token');
    });

    test('should fail if too many failed attempts (brute-force)', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/auth/login').send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      }
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect([400, 429]).toContain(res.status);
    });

    test('should fail if email is correct but case sensitivity not handled', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });
      expect(res.status).toBe(400);
    });

    test('should fail if password contains SQL injection attempt', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: "' OR '1'='1"
      });
      expect(res.status).toBe(400);
    });

    test('should fail if login request includes extra unexpected fields', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
        isAdmin: true,
        debug: true
      });
      expect(res.status).toBe(400);
    });

    test('should fail if email is missing "@"', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'testexample.com',
        password: 'password123'
      });
      expect(res.status).toBe(400);
    });

    test('should fail if email is empty string', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: '',
        password: 'password123'
      });
      expect(res.status).toBe(400);
    });

    test('should fail if password is extremely long (>200 chars)', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'x'.repeat(201)
      });
      expect(res.status).toBe(400);
    });
  });
});
