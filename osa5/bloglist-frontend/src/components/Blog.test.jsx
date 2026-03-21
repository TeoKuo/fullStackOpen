import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Kent Beck',
    url: 'https://example.com/testing-react-apps',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} user={blog.user} onLike={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Testing React Apps Kent Beck')).toBeInTheDocument()
    expect(screen.queryByText('https://example.com/testing-react-apps')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 7')).not.toBeInTheDocument()
  })

  test('renders url, likes and user name after view button is clicked', () => {
    render(<Blog blog={blog} user={blog.user} onLike={() => {}} onDelete={() => {}} />)

    fireEvent.click(screen.getByText('view'))

    expect(screen.getByText('https://example.com/testing-react-apps')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
    expect(screen.getByText('Matti Luukkainen')).toBeInTheDocument()
  })

  test('calls event handler twice when like button is clicked twice', () => {
    const handleLike = vi.fn()

    render(<Blog blog={blog} user={blog.user} onLike={handleLike} onDelete={() => {}} />)

    fireEvent.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)
  })
})
