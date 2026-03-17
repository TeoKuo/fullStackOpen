import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { mostLikes } from '../utils/list_helper.js';

describe('most likes', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = mostLikes(blogs);

    assert.strictEqual(result, null);
  });

  test('returns author whose blogs have most total likes', () => {
    const blogs = [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      },
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      },
      {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'https://example.com/tests',
        likes: 10,
      },
    ];

    const result = mostLikes(blogs);

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
