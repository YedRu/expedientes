import { promises as fs } from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const { code } = req.query
  const dataPath = path.join(process.cwd(), 'db', 'products.json')
  try {
    const raw = await fs.readFile(dataPath, 'utf8')
    const products = JSON.parse(raw)
    const found = products.find(p => p.code.toLowerCase() === String(code || '').toLowerCase())
    if (found) {
      res.status(200).json({ found: true, product: found })
    } else {
      res.status(200).json({ found: false })
    }
  } catch (err) {
    res.status(500).json({ error: 'failed to read products' })
  }
}
