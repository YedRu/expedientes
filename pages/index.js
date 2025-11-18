import { useState } from 'react'

export default function Home() {
  const [codigo, setCodigo] = useState('')
  const [producto, setProducto] = useState('')
  const [granel, setGranel] = useState('')
  const [lote, setLote] = useState('')
  const [cantidadEstimada, setCantidadEstimada] = useState('')
  const [registroSanitario, setRegistroSanitario] = useState('')
  const [nroFormula, setNroFormula] = useState('')
  const [comentario, setComentario] = useState('')
  const [message, setMessage] = useState('')

  async function lookupProduct(code) {
    if (!code) return
    const res = await fetch(`/api/products?code=${encodeURIComponent(code)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.found) {
        setProducto(data.product.nombre)
        setGranel(data.product.granel)
        setRegistroSanitario(data.product.registro_sanitario)
        setNroFormula(data.product.nro_formula)
        setComentario(data.product.comentario)
      } else {
        setProducto('')
        setGranel('')
        setRegistroSanitario('')
        setNroFormula('')
        setComentario('')
      }
    }
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setMessage('')
    const payload = { codigo, nombre: producto, granel, cantidad_estimada: cantidadEstimada }
    const res = await fetch('/api/expedientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const created = await res.json()
      setLote(created.lote)
      setMessage(`Guardado. Lote: ${created.lote}`)
    } else {
      const err = await res.text()
      setMessage('Error: ' + err)
    }
  }

  return (
    <div className="container">
      <h1>Generar Expediente</h1>
      <div className="layout-flex">
        <div className="form-container">
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Codigo del artículo</label>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onBlur={() => lookupProduct(codigo)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Producto</label>
              <input value={producto} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Granel</label>
              <input value={granel} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Registro Sanitario</label>
              <input value={registroSanitario} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Nro Formula</label>
              <input value={nroFormula} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Comentario</label>
              <input value={comentario} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Lote (se generará al crear)</label>
              <input value={lote} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Cantidad de granel (Kg)</label>
              <input value={cantidadEstimada} onChange={(e) => setCantidadEstimada(e.target.value)} className="form-input" />
            </div>

            <button type="submit" className="button">Generar y guardar</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  )
}
