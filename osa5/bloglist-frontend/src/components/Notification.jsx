const Notification = ({ message, error }) => {
  if (message === '') {
    return ''
  }

  const style = {
    color: error ? 'crimson' : 'green',
    background: '#f4f4f4',
    border: '1px solid',
    borderColor: error ? 'crimson' : 'green',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  }

  return <div style={style}>{message}</div>
}

export default Notification
