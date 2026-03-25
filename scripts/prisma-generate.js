const { execSync } = require('child_process')
const path = require('path')

const prismaPath = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js')
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')

process.env.DATABASE_URL = 'file:./dev.db'

execSync(`node "${prismaPath}" generate --schema="${schemaPath}"`, {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, DATABASE_URL: 'file:./dev.db' },
})
