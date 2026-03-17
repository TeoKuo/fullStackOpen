import 'dotenv/config';
import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';

const api = supertest(app);

describe('user api', () => {
  const testMongoUri = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;

  before(async () => {
    await mongoose.connect(testMongoUri, { dbName: 'blogilista_test' });
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await api.post('/api/users').send({
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    });
  });

  test('users are returned as json without password hashes', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, 1);
    assert.equal(response.body[0].username, 'root');
    assert.equal(response.body[0].passwordHash, undefined);
    assert.deepEqual(response.body[0].blogs, []);
  });

  test('users include their added blogs', async () => {
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret',
    });

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
      title: 'User blog',
      author: 'Root Author',
      url: 'https://example.com/user-blog',
      likes: 3,
      })
      .expect(201);

    const response = await api.get('/api/users').expect(200);
    const user = response.body[0];

    assert.strictEqual(user.blogs.length, 1);
    assert.equal(user.blogs[0].title, 'User blog');
  });

  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await api.get('/api/users').expect(200);
    const usernames = usersAtEnd.body.map((user) => user.username);

    assert.strictEqual(usersAtEnd.body.length, 2);
    assert.ok(usernames.includes(newUser.username));
  });

  test('creation fails with a proper status code and message if username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Another Root',
      password: 'salainen',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert.match(result.body.error, /expected `username` to be unique/i);

    const usersAtEnd = await api.get('/api/users').expect(200);
    assert.strictEqual(usersAtEnd.body.length, 1);
  });

  test('creation fails if username is missing', async () => {
    const newUser = {
      name: 'Nameless Username',
      password: 'salainen',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert.match(result.body.error, /username.*required/i);

    const usersAtEnd = await api.get('/api/users').expect(200);
    assert.strictEqual(usersAtEnd.body.length, 1);
  });

  test('creation fails if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Too Short Username',
      password: 'salainen',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert.match(result.body.error, /username.*shorter than the minimum allowed length/i);

    const usersAtEnd = await api.get('/api/users').expect(200);
    assert.strictEqual(usersAtEnd.body.length, 1);
  });

  test('creation fails if password is missing', async () => {
    const newUser = {
      username: 'missingpassword',
      name: 'Missing Password',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert.match(result.body.error, /password is required/i);

    const usersAtEnd = await api.get('/api/users').expect(200);
    assert.strictEqual(usersAtEnd.body.length, 1);
  });

  test('creation fails if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'shortpassword',
      name: 'Short Password',
      password: 'ab',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert.match(result.body.error, /password must be at least 3 characters long/i);

    const usersAtEnd = await api.get('/api/users').expect(200);
    assert.strictEqual(usersAtEnd.body.length, 1);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
