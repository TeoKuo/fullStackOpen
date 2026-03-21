const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label htmlFor="username">username</label>
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={onUsernameChange}
      />
    </div>
    <div>
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={onPasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginForm
