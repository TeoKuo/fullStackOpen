import { useState } from 'react'

const BlogForm = ({ onCreate }) => {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = event => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const created = await onCreate({
      title,
      author,
      url,
    })

    if (created) {
      setTitle('')
      setAuthor('')
      setUrl('')
      setVisible(false)
    }
  }

  if (!visible) {
    return <button onClick={() => setVisible(true)}>create new blog</button>
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={() => setVisible(false)}>
          cancel
        </button>
      </form>
    </div>
  )
}

export default BlogForm
