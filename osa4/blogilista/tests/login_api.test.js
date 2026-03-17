import 'dotenv/config';
import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/user.js';

const api = supertest(app);

describe('login api', () => {
  const testMongoUri = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;

  before(async () => {
    await mongoose.connect(testMongoUri, { dbName: 'blogilista_test' });
  });

  beforeEach(async () => {
    await User.deleteMany({});

    await api.post('/api/users').send({
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    });
  });

  test('login succeeds with valid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'sekret',
    };

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.ok(result.body.token);
    assert.equal(result.body.username, 'root');
    assert.equal(result.body.name, 'Superuser');
  });

  test('login fails with status code 401 and message for wrong password', async () => {
    const credentials = {
      username: 'root',
      password: 'wrong',
    };

    const result = await api.post('/api/login').send(credentials).expect(401);

    assert.match(result.body.error, /invalid username or password/i);
  });

  test('login fails with status code 401 and message for unknown user', async () => {
    const credentials = {
      username: 'unknown',
      password: 'sekret',
    };

    const result = await api.post('/api/login').send(credentials).expect(401);

    assert.match(result.body.error, /invalid username or password/i);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
