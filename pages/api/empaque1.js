import { promises as fs } from 'fs';
import path from 'path';

// ====================================================================
// STYLES FOR THE PDF (Optimizado para Carta)
// ====================================================================

const getStyles = () => `
<style>
/* Reset básico y tipografía para el PDF */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.2;
}

/* --- Estilos de la Cabecera (production-header) --- */
.production-header {
    display: table; /* Usamos table para asegurar alineación vertical estricta en PDF */
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.production-header > div {
    display: table-row;
}

.production-header .section {
    display: table-cell;
    border: 1px solid #000;
    padding: 0;
    vertical-align: top;
}

/* 1. Logo Area */
.logo-area {
    width: 25%;
    height: 60px; /* Altura combinada del top-row y main-title */
    text-align: center;
    padding: 5px;
    border-bottom: none !important; /* El borde inferior se maneja con emitter-row */
}

.logo-container {
    padding-top: 5px;
}

.logo-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #4CAF50;
}

/* 2. Center Area (Título) */
.center-area {
    width: 55%;
    border-left: none;
    border-right: none;
    padding: 0;
    height: 60px;
}

.center-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.top-row {
    flex: 1;
    text-align: center;
    font-size: 0.9em;
    font-weight: normal;
    padding: 3px 5px;
    border-bottom: 1px solid #000;
}

.main-title {
    flex: 2;
    text-align: center;
    font-size: 1.3em;
    font-weight: bold;
    color: #333;
    padding: 5px;
}

/* 3. Info Area (Códigos y Fechas) */
.info-area {
    width: 25%;
    border-left: none;
    border-right: 1px solid #000;
    padding: 0;
    height: 60px;
    text-align: center;
}

.info-row {
    padding: 3px 5px;
    font-size: 0.8em;
    border-bottom: 1px solid #000;
    height: 15px; /* Altura para 4 filas de info */
    box-sizing: border-box;
}

.info-row:last-child {
    border-bottom: none;
}

/* Fila Inferior - Departamento Emisor */
.emitter-row {
    display: table-row; /* Necesario para que ocupe todo el ancho */
}

.emitter-cell {
    grid-column: 1 / 4;
    padding: 5px;
    font-size: 0.8em;
    background-color: #f0f0f0;
    font-weight: bold;
    border-top: 1px solid #000;
    border: 1px solid #000;
}


/* --- Estilos del Cuerpo (Orden de Planificación, Presentaciones, etc.) --- */

.section-body {
    margin-top: 10px;
}

.section-title {
    text-align: center;
    font-size: 10pt;
    font-weight: bold;
    padding: 5px;
    background-color: #e0e0e0;
    border: 1px solid #000;
    border-bottom: none;
}

/* Estilos de Tabla Comunes */
.tabla-general {
    width: 100%;
    border-collapse: collapse;
}

.tabla-general td {
    border: 1px solid #000;
    padding: 5px;
    vertical-align: middle;
    height: 18px; 
    box-sizing: border-box;
    font-size: 9pt;
}

.etiqueta {
    background-color: #f0f0f0; 
    font-weight: bold;
    text-align: left;
    white-space: nowrap;
    width: 16%; /* Ancho ajustado para etiquetas */
}

.valor {
    text-align: center;
    width: 16%; 
    font-weight: normal;
}

/* ORDEN DE PLANIFICACIÓN */
.descripcion-producto-label {
    width: 38%;
    text-align: center;
}

.descripcion-producto-valor {
    font-weight: bold;
    font-size: 10pt;
    text-align: center;
    text-transform: uppercase;
}

.status-circulo {
    width: 10%;
    border: 2px dashed #000;
    border-radius: 50%;
    height: 70px;
    min-width: 50px;
    padding: 0;
}

.cantidad-a-producir {
    background-color: #c9c9c9;
    font-weight: bold;
    font-size: 10pt;
}

.nro-formula-info {
    text-align: left;
    background-color: white;
    font-weight: bold;
    font-size: 9pt;
    padding-right: 15px;
}

/* PRESENTACIONES */
.tabla-presentaciones .etiqueta {
    width: 14%;
    
    
}
.tabla-presentaciones .valor {
    width: 20px;
    height: auto;
    text-align: left;
    font-weight: normal;
    
}
.presentacion-detalle {
    width: 30%;
    text-align: left;
    font-weight: normal;
}
.unidades-num {
    background-color: #c9c9c9;
    font-weight: bold;
}
</style>
`;

const renderHtml = (data, logoDataUrl) => `
<!doctype html>
<html>
<head>
 <meta charset="utf-8" />
 <title>${data.titulo || 'Orden de Empaque'}</title>
 ${getStyles()}
</head>
<body>
    <table class="production-header">
        <tbody>
            <tr>
                <td class="section logo-area">
                    <div class="logo-container">
                        ${logoDataUrl ? `<img src="${logoDataUrl}" alt="logo" style="width: 90%" class="logo-image";"/>` : ''}
                    </div>
                </td>

                <td class="section center-area">
                    <div class="center-content">
                        <div class="top-row">
                            ${data.subtitle || 'Procedimiento de producción'}
                        </div>
                        <div class="main-title">
                            ${data.titulo || 'ORDEN DE EMPAQUE'}
                        </div>
                    </div>
                </td>

                <td class="section info-area">
                    <div class="info-row">Código: ${data.codigo_header || 'F-QE-PR-002'}</div>
                    <div class="info-row">Revisión: ${data.revision || '1'}</div>
                    <div class="info-row">Fecha de emisión: ${data.fecha_emision || '19/10/2021'}</div>
                    <div class="info-row">Vigencia hasta: ${data.vigencia || '19/10/2024'}</div>
                    <div class="info-row page-number">Página: ${data.pagina || '1/1'}</div>
                </td>
            </tr>
            
            <tr class="emitter-row">
                <td class="emitter-cell" colspan="3"> 
                    Departamento Emisor: <strong>Planificación y Compras</strong>
                </td>
            </tr>
        </tbody>
    </table>

    <main class="document-body">
        <div class="section-body">
            <div class="section-title">ORDEN DE EMPAQUE</div>
            <table class="tabla-general tabla-planificacion">
                <tr>
                    <td class="etiqueta">Nº Lote:</td>
                    <td class="valor">${data.lote || '0'}</td>
                    <td class="etiqueta descripcion-producto-label" colspan="2">Descripción Producto</td>
                    <td class="etiqueta status-label">Status:</td>
                </tr>
                <tr>
                    <td class="etiqueta">Orden:</td>
                    <td class="valor">${'Q' + data.lote || '#N/D'}</td>
                    <td class="valor descripcion-producto-valor" colspan="2" rowspan="2">
                        ${data.nombre || '#N/D'}
                    </td>
                    <td class="status-circulo" rowspan="3"></td>
                </tr>
                <tr>
                    <td class="etiqueta">Código Producto:</td>
                    <td class="valor">${data.codigo || '#N/D'}</td>
                </tr>
                <tr>
                    <td class="etiqueta">Fecha Emisión</td>
                    <td class="valor">${data.fecha_emision || '#N/D'}</td>
                    <td class="etiqueta registro-sanitario-label">Registro Sanitario:</td>
                    <td class="valor registro-sanitario-valor">${data.registro_sanitario || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="section-body">
            <div class="section-title">PRESENTACIONES</div>
            <table class="tabla-general tabla-presentaciones">
                <tr>
                    <td class="etiqueta orden-empaque-label">Orden de Empaque 1:</td>
                    <td class="valor orden-empaque-num">${data.lote + '- 1' || ''}</td>
                    <td class="etiqueta presentacion-label">Presentación:</td>
                    <td class="valor presentacion-detalle">${data.nombre || ''}</td>
                    <td class="etiqueta unidades-label">Unidades a Producir:</td>
                    <td class="valor unidades-num">${data.cantidad_estimada_pt || ''}</td>
                </tr>
            </table>
        </div>
    </main>
</body>
</html>
`;

// ====================================================================
// CONFIGURACIÓN DE PUPPETEER (Ajuste de Formato)
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
            const logoPath = path.join(process.cwd(), 'ol_color.png');
            const buf = await fs.readFile(logoPath);
            logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
        } catch (e) {
            // Logo not found, proceed without it
        }

        const data = req.body || {};
        const today = new Date();
        data.fecha_emision = today.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Se usa req.body para poblar los datos
        const html = renderHtml(data, logoDataUrl);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ 
            format: 'letter',
            printBackground: true, 
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=empaque1.pdf');
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
