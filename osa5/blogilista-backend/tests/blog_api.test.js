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

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'https://example.com/first',
    likes: 4,
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'https://example.com/second',
    likes: 9,
  },
];

describe('blog api', () => {
  const testMongoUri = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;
  let authToken;

  before(async () => {
    await mongoose.connect(testMongoUri, { dbName: 'blogilista_test' });
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const userResponse = await api.post('/api/users').send({
      username: 'root',
      name: 'Superuser',
      password: 'sekret',
    });

    const user = await User.findById(userResponse.body.id);
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret',
    });
    authToken = loginResponse.body.token;

    const savedBlogs = await Blog.insertMany(
      initialBlogs.map((blog) => ({
        ...blog,
        user: user._id,
      }))
    );

    await User.findByIdAndUpdate(user._id, {
      blogs: savedBlogs.map((blog) => blog._id),
    });
  });

  describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs').expect(200);
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test('the unique identifier field of blogs is named id', async () => {
      const response = await api.get('/api/blogs').expect(200);
      const blog = response.body[0];

      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });

    test('blogs include the adding user details', async () => {
      const response = await api.get('/api/blogs').expect(200);
      const blog = response.body[0];

      assert.equal(blog.user.username, 'root');
      assert.equal(blog.user.name, 'Superuser');
    });
  });

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Testing POST with SuperTest',
        author: 'Test Author',
        url: 'https://example.com/new-blog',
        likes: 11,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs').expect(200);

      assert.strictEqual(response.body.length, initialBlogs.length + 1);
      const titles = response.body.map((blog) => blog.title);
      assert.ok(titles.includes(newBlog.title));
      assert.equal(response.body.at(-1).user.username, 'root');
    });

    test('defaults likes to 0 if value is missing', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'No Likes Author',
        url: 'https://example.com/no-likes',
      };

      const postResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(postResponse.body.likes, 0);
    });

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'No Title Author',
        url: 'https://example.com/no-title',
        likes: 2,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400);
    });

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'No URL blog',
        author: 'No URL Author',
        likes: 2,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400);
    });

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Unauthorized blog',
        author: 'Unauthorized Author',
        url: 'https://example.com/unauthorized',
      };

      const result = await api.post('/api/blogs').send(newBlog).expect(401);

      assert.match(result.body.error, /token invalid/i);
    });

    test('uses the token owner as the blog user', async () => {
      await api.post('/api/users').send({
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      });

      const loginResponse = await api.post('/api/login').send({
        username: 'mluukkai',
        password: 'salainen',
      });

      const newBlog = {
        title: 'Owned by second user',
        author: 'Token Owner',
        url: 'https://example.com/token-owner',
      };

      const postResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201);

      assert.equal(postResponse.body.user.username, 'mluukkai');
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if creator token is valid', async () => {
      const blogsAtStart = await api.get('/api/blogs').expect(200);
      const blogToDelete = blogsAtStart.body[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const blogsAtEnd = await api.get('/api/blogs').expect(200);
      assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);

      const titles = blogsAtEnd.body.map((blog) => blog.title);
      assert.ok(!titles.includes(blogToDelete.title));
    });

    test('fails with status code 401 if token is missing', async () => {
      const blogsAtStart = await api.get('/api/blogs').expect(200);
      const blogToDelete = blogsAtStart.body[0];

      const result = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      assert.match(result.body.error, /token invalid/i);
    });

    test('fails with status code 403 if token belongs to another user', async () => {
      await api.post('/api/users').send({
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      });

      const loginResponse = await api.post('/api/login').send({
        username: 'mluukkai',
        password: 'salainen',
      });

      const blogsAtStart = await api.get('/api/blogs').expect(200);
      const blogToDelete = blogsAtStart.body[0];

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(403);

      assert.match(result.body.error, /only the creator can delete a blog/i);
    });
  });

  describe('updating a blog', () => {
    test('succeeds with valid data and updates likes', async () => {
      const blogsAtStart = await api.get('/api/blogs').expect(200);
      const blogToUpdate = blogsAtStart.body[0];
      const updatedData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10,
      };

      const putResponse = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(putResponse.body.likes, updatedData.likes);

      const blogsAtEnd = await api.get('/api/blogs').expect(200);
      assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length);

      const persistedBlog = blogsAtEnd.body.find((blog) => blog.id === blogToUpdate.id);
      assert.strictEqual(persistedBlog.likes, updatedData.likes);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
