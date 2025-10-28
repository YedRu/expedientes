import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db')

export async function readDB(filename) {
  const filePath = path.join(DB_PATH, filename)
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    // If file doesn't exist, return empty array
    if (err.code === 'ENOENT') {
      return []
    }
    throw err
  }
}

export async function writeDB(filename, data) {
  const filePath = path.join(DB_PATH, filename)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}
