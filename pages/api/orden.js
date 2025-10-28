import { promises as fs } from 'fs'
import path from 'path'

// ====================================================================
// HTML TEMPLATE FOR THE PDF
// ====================================================================

const getStyles = () => `
<style>
.small-boxes {
    /* Convierte el contenedor en una fila de columnas */
    display: flex;
    /* Distribuye el espacio entre las 3 columnas por igual */
    justify-content: space-around;
    /* Agrega un borde exterior */
    border: 1px solid #004c99; /* El color azul que se ve en la imagen */
}

/* Estilo para cada columna (Registro Sanitario, Nro Formula, Comentario) */
.small-boxes > div {
    /* Hace que cada columna ocupe el mismo ancho */
    flex-basis: calc(100% / 3);
    /* Relleno interno para que el texto no toque los bordes */
    padding: 8px;
    /* Agrega un borde a la derecha para separar las columnas */
    border-right: 1px solid #004c99;
    /* Asegura que el contenido se envuelva si es muy largo */
    word-break: break-word;
}

/* Quita el borde derecho de la última columna */
.small-boxes > div:last-child {
    border-right: none;
}

/* Línea separadora entre el encabezado y el contenido */
.small-boxes > div > div:first-child {
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #ccc; /* Una línea más clara para el divisor interno */
}

/* Styles from index.js */
.container {
    max-width: 920px;
    margin: 24px auto;
    font-family: Arial, sans-serif;
}

.layout-flex {
    display: flex;
    gap: 24px;
}

.form-container {
    flex: 1;
}

.form-group {
    margin-bottom: 12px;
}

.form-group label {
    display: block;
    margin-bottom: 4px;
}

.form-input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.button {
    padding: 8px 16px;
}

.message {
    margin-top: 16px;
}

.preview-area {
    width: 420px;
}

.preview-actions {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}

.button-secondary {
    padding: 8px 12px;
}

/* Styles from PreviewCard component */
.preview-card {
    border: 1px solid #ccc;
    padding: 12px;
    border-radius: 4px;
    background: #fff;
}

.preview-card-header {
    overflow: hidden;
}

.preview-logo-placeholder {
    float: left;
    width: 120px;
    height: 60px;
    border: 1px solid #999;
}

.preview-title-section {
    margin-left: 140px;
}

.preview-subtitle {
    text-align: center;
    font-size: 12px;
    color: #333;
}

.preview-title-box {
    border: 1px solid #000;
    margin-top: 6px;
    padding: 6px;
}

.preview-title {
    font-weight: 700;
    font-size: 20px;
    text-align: center;
}

.preview-meta {
    border: 1px solid #333;
    padding: 8px;
    width: 220px;
    float: right;
    text-align: right;
}

.preview-meta-item {
    font-size: 12px;
}

.preview-meta-page {
    font-size: 11px;
    margin-top: 6px;
}

.preview-body {
    clear: both;
    margin-top: 14px;
}

.production-header {
    display: grid;
    /* Define 3 columnas principales y 2 filas (encabezado superior y fila inferior) */
    grid-template-columns: 25% 45% 30%; /* Ajusta los porcentajes según el ancho deseado */
    grid-template-rows: 1fr auto;
    border: 1px solid #000; /* Borde exterior */
    font-family: Arial, sans-serif;
    width: 100%;
}

.section {
    border-right: 1px solid #000;
    padding: 5px;
    box-sizing: border-box;
}

/* 1. Estilos del Logo */
.logo-area {
    grid-row: 1 / 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #000; /* Separador del logo de la fila del emisor */
    /* En el diseño original el logo ocupa el alto de la info y del título */
    border-right: 1px solid #000;
    padding: 10px;
}

.logo-container {
    text-align: center;
    /* Estilos para simular el logo */
}

.logo-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #4CAF50; /* Color verde del texto \"Laboratorios\" */
}

/* 2. Estilos del Centro */
.center-area {
    grid-row: 1 / 2;
    display: flex;
    flex-direction: column;
    text-align: center;
    border-bottom: 1px solid #000;
}

.top-row {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    font-weight: normal;
    padding: 5px;
    border-bottom: 1px solid #000;
}

.main-title {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    padding: 10px;
}

/* 3. Estilos de la Información Derecha */
.info-area {
    grid-row: 1 / 2;
    display: flex;
    flex-direction: column;
    border-right: none; /* Eliminar el borde derecho final */
    border-bottom: 1px solid #000;
}

.info-row {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 3px 5px;
    font-size: 0.8em;
    border-bottom: 1px solid #000;
}

.info-row:last-child {
    border-bottom: none;
}

/* Fila Inferior - Departamento Emisor */
.emitter-row {
    grid-column: 1 / 4; /* Ocupa las 3 columnas */
    padding: 5px;
    font-size: 0.8em;
    background-color: #f0f0f0; /* Puede ser útil para separarlo visualmente */
}
</style>
`;

const renderHtml = (data, logoDataUrl) => `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.titulo || 'Orden de Producción'}</title>
  ${getStyles()}
</head>
<body>
  <header class="production-header">
      <div class="section logo-area">
          <div class="logo-container">
              ${logoDataUrl ? `<img src="${logoDataUrl}" alt="logo" style="width: 100px;"/>` : '<div class="logo"></div>'}
              <p class="logo-text">Laboratorios</p>
          </div>
      </div>

      <div class="section center-area">
          <div class="top-row">
              ${data.subtitle || 'Procedimiento de producción'}
          </div>
          <div class="main-title">
              ${data.titulo || 'ORDEN DE PRODUCCIÓN'}
          </div>
      </div>

      <div class="section info-area">
          <div class="info-row">
              <span>Código: ${data.codigo_header || ''}</span>
          </div>
          <div class="info-row">
              <span>Revisión: ${data.revision || ''}</span>
          </div>
          <div class="info-row">
              <span>Fecha de emisión: ${data.fecha || ''}</span>
          </div>
          <div class="info-row">
              <span>Vigencia hasta: ${data.vigencia || ''}</span>
          </div>
          <div class="info-row page-number">
              <span>Página: ${data.pagina || ''}</span>
          </div>
      </div>
      
      <div class="emitter-row">
          Departamento Emisor: <strong>Planificación y Compras</strong>
      </div>
  </header>
</body>
</html>
`;;

// ====================================================================
// API HANDLER
// ====================================================================

async function getPuppeteer() {
  try {
    return await import('puppeteer');
  } catch (e) {
    try {
      return await import('puppeteer-core');
    } catch (e2) {
      return null;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const puppeteerModule = await getPuppeteer();
  if (!puppeteerModule) {
    return res.status(500).json({ error: 'puppeteer_not_installed', detail: 'Install "puppeteer" or "puppeteer-core"' });
  }

  const puppeteer = puppeteerModule.default || puppeteerModule;
  const launchOptions = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH || process.env.CHROME_BIN;
  if (execPath) {
    launchOptions.executablePath = execPath;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    let logoDataUrl = null;
    try {
      const logoPath = path.join(process.cwd(), 'templates', 'logo.png');
      const buf = await fs.readFile(logoPath);
      logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
    } catch (e) {
      // Logo not found, proceed without it
    }

    const html = renderHtml(req.body || {}, logoDataUrl);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' } });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=orden.pdf');
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error', err);
    res.status(500).json({ error: 'pdf_generation_failed', detail: String(err) });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}