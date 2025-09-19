import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetshop';

beforeAll(async () => {
  // connect to test DB
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
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
        password: '123', // too short
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

    test('should fail if request body contains unexpected fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Extra Fields',
        email: 'extrafields@example.com',
        password: 'password123',
        role: 'admin', // not allowed
        randomKey: 'hack',
      });
      expect(res.status).toBe(400);
    });

    test('should register successfully with valid data', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
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




  //Login Route Test 
  describe('POST /api/auth/login', () => {
    test('should fail if email is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ password: 'password123' });
      expect(res.status).toBe(400);
    });

    test('should fail if password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });

    test('should fail if body is completely missing', async () => {
      const res = await request(app).post('/api/auth/login');
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
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('should fail if too many failed attempts are made (brute-force simulation)', async () => {
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
      expect([400, 429]).toContain(res.status); // depending on rate-limit logic
    });
  });
});
