import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls onCreate with correct blog data when form is submitted', async () => {
    const handleCreate = vi.fn().mockResolvedValue(true)

    render(<BlogForm onCreate={handleCreate} />)

    fireEvent.click(screen.getByText('create new blog'))

    fireEvent.change(screen.getByRole('textbox', { name: 'title' }), {
      target: { value: 'Refactoring UI' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'author' }), {
      target: { value: 'Adam Wathan' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'url' }), {
      target: { value: 'https://example.com/refactoring-ui' },
    })

    fireEvent.click(screen.getByText('create'))

    expect(handleCreate).toHaveBeenCalledTimes(1)
    expect(handleCreate).toHaveBeenCalledWith({
      title: 'Refactoring UI',
      author: 'Adam Wathan',
      url: 'https://example.com/refactoring-ui',
    })
  })
})
