import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { totalLikes } from '../utils/list_helper.js';

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = [];
    const result = totalLikes(blogs);

    assert.strictEqual(result, 0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const blogs = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      },
    ];

    const result = totalLikes(blogs);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
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

    const result = totalLikes(blogs);
    assert.strictEqual(result, 24);
  });
});
