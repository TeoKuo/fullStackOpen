import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { favoriteBlog } from '../utils/list_helper.js';

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = favoriteBlog(blogs);

    assert.strictEqual(result, null);
  });

  test('is the blog with most likes', () => {
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
    ];

    const result = favoriteBlog(blogs);

    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    });
  });
});
