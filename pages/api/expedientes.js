import { readDB, writeDB } from '../../lib/db'

function currentYYMM() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return yy + mm
}

function nextSuffixForPrefix(records, prefix) {
  // suffix is two digits NN
  const suffixes = records
    .filter(r => typeof r.lote === 'string' && r.lote.startsWith(prefix))
    .map(r => parseInt(r.lote.slice(prefix.length) || '0', 10))
    .filter(n => !Number.isNaN(n))
  const max = suffixes.length ? Math.max(...suffixes) : 0
  const next = max + 1
  return String(next).padStart(2, '0')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const all = await readDB('expedientes.json')
    res.status(200).json(all)
    return
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    const { codigo = '', nombre = '', granel = '', cantidad_estimada = '' } = body
    const records = await readDB('expedientes.json')
    const prefix = currentYYMM()
    const suffix = nextSuffixForPrefix(records, prefix)
    const lote = prefix + suffix
    const record = {
      id: Date.now(),
      codigo,
      nombre,
      granel,
      cantidad_estimada,
      lote,
      created_at: new Date().toISOString() 
    }
    records.push(record)
    await writeDB('expedientes.json', records)
    res.status(201).json(record)
    return
  }

  res.setHeader('Allow', 'GET, POST')
  res.status(405).end('Method Not Allowed')
}
