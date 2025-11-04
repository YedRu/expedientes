import { useState, useEffect, useRef } from 'react'
import ProductionHeader from '../components/ProductionHeader'

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
  const [preview, setPreview] = useState({})

  useEffect(() => {
    setPreview(p => ({
      ...p,
      codigo,
      nombre: producto,
      granel,
      cantidad_estimada: cantidadEstimada,
      registro_sanitario: registroSanitario,
      nro_formula: nroFormula,
      comentario: comentario
    }))
  }, [codigo, producto, granel, cantidadEstimada, registroSanitario, nroFormula, comentario])

  const previewRef = useRef(null)

  function handlePrint() {
    if (!previewRef.current) return
    const content = previewRef.current.innerHTML
    const win = window.open('', '_blank', 'noopener,noreferrer')
    if (!win) return
    const style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .preview-card { border: none; }
      </style>`
    win.document.open()
    win.document.write(`<html><head><title>Imprimir Expediente</title>${style}</head><body>${content}</body></html>`)
    win.document.close()
    setTimeout(() => {
      win.focus()
      win.print()
    }, 300)
  }

  const [downloading, setDownloading] = useState(false)

  async function handleDownloadPDF() {
    setDownloading(true)
    try {
      const payload = {
        ...preview, // Send all preview data to the PDF generator
        titulo: 'ORDEN DE PRODUCCIÓN',
        subtitle: 'Procedimiento de producción',
        codigo_header: 'F-GE-PR001',
        revision: '2',
        fecha: '19/10/2025',
        vigencia: '27/10/2028',
        pagina: '1/2',
        cantidad_producir: cantidadEstimada || ''
      }

      const res = await fetch('/api/orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'PDF generation failed')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      console.error(err)
      setMessage('Error al generar PDF: ' + (err.message || err))
    } finally {
      setDownloading(false)
    }
  }

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
      setPreview(prev => ({
        ...prev,
        lote: created.lote,
        fecha: new Date(created.created_at).toLocaleDateString(),
      }))
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
              <label>Cantidad estimada a producir (Kg)</label>
              <input value={cantidadEstimada} onChange={(e) => setCantidadEstimada(e.target.value)} className="form-input" />
            </div>

            <button type="submit" className="button">Generar y guardar</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>

        <div className="preview-area">
          <h3>Vista previa</h3>
          <div ref={previewRef}>
            <ProductionHeader />
          </div>
          <div className="preview-actions">
            <button onClick={handlePrint} className="button-secondary" disabled={!preview.lote && !preview.codigo}>Imprimir</button>
            <button onClick={handleDownloadPDF} className="button-secondary" disabled={downloading || (!preview.codigo && !preview.lote)}>
              {downloading ? 'Generando...' : 'Guardar en PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
