import { useState } from 'react'

export default function Home() {
  const [codigo, setCodigo] = useState('')
  const [producto, setProducto] = useState('')
  const [granel, setGranel] = useState('')
  const [lote, setLote] = useState('')
  const [cantidadEstimada, setCantidadEstimada] = useState('')
  const [cantidadEstimadaPT, setCantidadEstimadaPT] = useState('')
  const [registroSanitario, setRegistroSanitario] = useState('')
  const [nroFormula, setNroFormula] = useState('')
  const [fechaEmpaqueEst, setFechaEmpaqueEst] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [message, setMessage] = useState('')
  const [downloading, setDownloading] = useState(false)

  async function handleDownloadPDF() {
    setDownloading(true)
    try {
      const payload = {
        codigo,
        nombre: producto,
        granel,
        cantidad_estimada: cantidadEstimada,
        cantidad_estimada_pt: cantidadEstimadaPT,
        registro_sanitario: registroSanitario,
        nro_formula: nroFormula,
        lote,
        fecha: new Date().toLocaleDateString(),
        titulo: 'ORDEN DE PRODUCCIÓN',
        subtitle: 'Procedimiento de producción',
        codigo_header: 'F-GE-PR001',
        revision: '2',
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

  async function handleDownloadEmpaquePDF() {
    setDownloading(true)
    try {
      const payload = {
        lote,
        orden: lote,
        nombre: producto,
        fecha_empaque_est: fechaEmpaqueEst,
        codigo_producto: codigo,
        fecha_vencimiento: fechaVencimiento,
        registro_sanitario: registroSanitario,
        unidades_a_envasar: cantidadEstimadaPT,
      }

      const res = await fetch('/api/empaque1', {
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
      setMessage('Error al generar PDF de empaque: ' + (err.message || err))
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
      } else {
        setProducto('')
        setGranel('')
        setRegistroSanitario('')
        setNroFormula('')
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
        <div className="form-card">
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
              <label>Lote (se generará al crear)</label>
              <input value={lote} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label>Cantidad estimada a producir (Kg)</label>
              <input value={cantidadEstimada} onChange={(e) => setCantidadEstimada(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label>Cantidad estimada de PT</label>
              <input value={cantidadEstimadaPT} onChange={(e) => setCantidadEstimadaPT(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label>Fecha Empaque Estimada</label>
              <input type="date" value={fechaEmpaqueEst} onChange={(e) => setFechaEmpaqueEst(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label>Fecha Vencimiento</label>
              <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="form-input" />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="button">Generar y guardar</button>
                <button type="button" onClick={handleDownloadPDF} className="button-secondary" disabled={downloading || !codigo}>
                    {downloading ? 'Generando...' : 'Guardar Orden en PDF'}
                </button>
                <button type="button" onClick={handleDownloadEmpaquePDF} className="button-secondary" disabled={downloading || !codigo}>
                    {downloading ? 'Generando...' : 'Guardar Empaque en PDF'}
                </button>
            </div>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  )
}
