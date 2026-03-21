const path = require('path')
const { spawn } = require('child_process')

const rootDir = __dirname
const backendDir = path.join(rootDir, '..', 'blogilista-backend')
const frontendDir = path.join(rootDir, '..', 'bloglist-frontend')

const startCommand = (cwd, args) => {
  if (process.platform === 'win32') {
    return spawn(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], {
      cwd,
      stdio: 'inherit',
    })
  }

  return spawn('npm', args, {
    cwd,
    stdio: 'inherit',
  })
}

const children = [
  startCommand(backendDir, ['run', 'dev:test']),
  startCommand(frontendDir, ['run', 'dev', '--', '--host', '127.0.0.1']),
]

const stopChildren = () => {
  for (const child of children) {
    if (child.killed) {
      continue
    }

    child.kill('SIGTERM')
  }
}

for (const child of children) {
  child.on('exit', code => {
    if (code !== 0) {
      stopChildren()
      process.exit(code ?? 1)
    }
  })
}

process.on('SIGINT', () => {
  stopChildren()
  process.exit(0)
})

process.on('SIGTERM', () => {
  stopChildren()
  process.exit(0)
})

setInterval(() => {}, 1000)
