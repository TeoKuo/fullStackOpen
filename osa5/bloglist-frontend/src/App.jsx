import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const timeout = 5000

const sortBlogsByLikes = blogs =>
  blogs.slice().sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)

const normalizeBlog = (updatedBlog, blogToLike) => ({
  ...updatedBlog,
  user:
    typeof updatedBlog.user === 'object' && updatedBlog.user !== null && updatedBlog.user.name
      ? updatedBlog.user
      : blogToLike.user,
})

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(sortBlogsByLikes(blogs))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showMessage = newMessage => {
    setError(false)
    setMessage(newMessage)

    setTimeout(() => {
      setMessage('')
    }, timeout)
  }

  const showErrorMessage = newMessage => {
    setError(true)
    setMessage(newMessage)

    setTimeout(() => {
      setError(false)
      setMessage('')
    }, timeout)
  }

  const handleUsernameChange = event => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      showMessage(`${loggedUser.name} logged in`)
    } catch {
      showErrorMessage('wrong username/password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    showMessage('logged out')
  }

  const handleCreateBlog = async newBlog => {
    try {
      const createdBlog = await blogService.create(newBlog)

      setBlogs(currentBlogs => sortBlogsByLikes(currentBlogs.concat(createdBlog)))
      showMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      return true
    } catch {
      showErrorMessage('creating a blog failed')
      return false
    }
  }

  const handleLikeBlog = async blogToLike => {
    try {
      const updatedBlog = await blogService.update(blogToLike.id, {
        user: blogToLike.user.id || blogToLike.user._id || blogToLike.user,
        likes: blogToLike.likes + 1,
        author: blogToLike.author,
        title: blogToLike.title,
        url: blogToLike.url,
      })

      const changedBlog = normalizeBlog(updatedBlog, blogToLike)

      setBlogs(currentBlogs => sortBlogsByLikes(
        currentBlogs.map(blog => blog.id === blogToLike.id ? changedBlog : blog)
      ))
    } catch {
      showErrorMessage(`updating blog ${blogToLike.title} failed`)
    }
  }

  const handleDeleteBlog = async blogToDelete => {
    const confirmed = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blogToDelete.id)
      setBlogs(currentBlogs => currentBlogs.filter(blog => blog.id !== blogToDelete.id))
      showMessage(`removed blog ${blogToDelete.title}`)
    } catch {
      showErrorMessage(`deleting blog ${blogToDelete.title} failed`)
    }
  }

  return (
    <div>
      <Notification
        message={message}
        error={error}
      />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            onUsernameChange={handleUsernameChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </div>
          <BlogForm onCreate={handleCreateBlog} />
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onLike={handleLikeBlog}
              onDelete={handleDeleteBlog}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
