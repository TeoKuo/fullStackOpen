import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mostBlogs } from '../utils/list_helper.js';

describe('most blogs', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = mostBlogs(blogs);

    assert.strictEqual(result, null);
  });

  test('returns author with highest blog count', () => {
    const blogs = [
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        url: 'https://example.com/clean-code',
        likes: 5,
      },
      {
        title: 'Agile Software Development',
        author: 'Robert C. Martin',
        url: 'https://example.com/agile',
        likes: 10,
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        url: 'https://example.com/pragmatic',
        likes: 8,
      },
      {
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        url: 'https://example.com/clean-architecture',
        likes: 7,
      },
      {
        title: 'Refactoring',
        author: 'Martin Fowler',
        url: 'https://example.com/refactoring',
        likes: 12,
      },
    ];

    const result = mostBlogs(blogs);

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
