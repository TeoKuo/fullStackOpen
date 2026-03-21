import { useState } from 'react'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleLabel = detailsVisible ? 'hide' : 'view'
  const canDelete = user && blog.user && blog.user.username === user.username

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {toggleLabel}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {canDelete && (
            <button onClick={() => onDelete(blog)}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
