import { useState, useCallback } from 'react'

const initialProductData = {
  nombre: '',
  granel: '',
  registro_sanitario: '',
  nro_formula: '',
  comentario: ''
}

function GeneratedDocs({ lote }) {
  if (!lote) return null

  return (
    <div className="layout-flex">
      <div className="form-container">
        <h3>Documentos Generados</h3>
        <p>Lote: {lote}</p>
        <div className="button-group">
          <a href={`/api/orden?lote=${lote}`} target="_blank" rel="noopener noreferrer" className="button">Generar Orden de Producción</a>
          <a href={`/api/empaque1?lote=${lote}`} target="_blank" rel="noopener noreferrer" className="button">Generar Orden de Empaque</a>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [codigo, setCodigo] = useState('')
  const [productData, setProductData] = useState(initialProductData)
  const [lote, setLote] = useState('')
  const [cantidadEstimada, setCantidadEstimada] = useState('')
  const [message, setMessage] = useState('')

  const lookupProduct = useCallback(async (code) => {
    if (!code) return
    setMessage('')
    try {
      const res = await fetch(`/api/products?code=${encodeURIComponent(code)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.found) {
          setProductData(data.product)
        } else {
          setProductData(initialProductData)
          setMessage('Producto no encontrado.')
        }
      } else {
        const err = await res.text()
        setMessage(`Error al buscar: ${err}`)
        setProductData(initialProductData)
      }
    } catch (error) {
      setMessage(`Error de red al buscar el producto: ${error.message}`)
      setProductData(initialProductData)
    }
  }, [])

  const handleGenerate = useCallback(async (e) => {
    e.preventDefault()
    setMessage('')
    const payload = {
      codigo,
      nombre: productData.nombre,
      granel: productData.granel,
      cantidad_estimada: cantidadEstimada
    }
    try {
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
        setMessage('Error al generar: ' + err)
      }
    } catch (error) {
      setMessage(`Error de red al generar el expediente: ${error.message}`)
    }
  }, [codigo, productData, cantidadEstimada])

  return (
    <div className="container">
      <h1>Generar Expediente</h1>
      <div className="layout-flex">
        <div className="form-container">
          <form onSubmit={handleGenerate} noValidate>
            <div className="form-group">
              <label>Codigo del artículo</label>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onBlur={(e) => lookupProduct(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Producto</label>
              <input value={productData.nombre} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Granel</label>
              <input value={productData.granel} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Registro Sanitario</label>
              <input value={productData.registro_sanitario} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Nro Formula</label>
              <input value={productData.nro_formula} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Comentario</label>
              <input value={productData.comentario} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Lote (se generará al crear)</label>
              <input value={lote} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Cantidad de granel (Kg)</label>
              <input
                value={cantidadEstimada}
                onChange={(e) => setCantidadEstimada(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="button">Generar y guardar</button>
          </form>

          {message && <p className="message">{message}</p>}
          <GeneratedDocs lote={lote} />
        </div>
      </div>
    </div>
  )
}
