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
    text-align: right;
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
    width: 18%;
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

/* DESPEJE DE ÁREA DE PESADA */
.subtitulo-despeje {
    text-align: center;
    font-style: italic;
    font-size: 8pt;
    padding: 2px 0;
}

.tabla-despeje th {
    background-color: #f0f0f0;
    font-weight: bold;
    border: 1px solid #000;
    padding: 5px;
    text-align: center;
    font-size: 9pt;
}

.tabla-despeje .categoria {
    background-color: #c9c9c9;
    font-weight: bold;
    text-align: center;
}

.check-cell {
    text-align: center;
    width: 10%;
    height: 18px;
}

.check-mark {
    font-weight: bold;
    font-size: 11pt;
}

.condicion {
    text-align: left;
}

.responsable-fila .etiqueta {
    width: 75%;
    text-align: left;
    padding-left: 10px;
}

.responsable-fila .valor {
    width: 25%;
    text-align: left;
    font-weight: bold;
}

.observaciones-area {
    border: 1px solid #000;
    border-top: none;
    background-color: white;
}

.observaciones-label {
    background-color: #f0f0f0;
    font-weight: bold;
    padding: 5px;
    border-bottom: 1px solid #000;
    font-size: 9pt;
}

.caja-observaciones {
    height: 50px; 
    padding: 5px;
    font-size: 9pt;
}

.footer-despeje {
    border: 1px solid #000;
    border-top: none;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    font-weight: bold;
    font-size: 9pt;
    background-color: white;
}

/* VALIDACIÓN */
.tabla-validacion {
    margin-top: 10px;
}

.tabla-validacion .etiqueta {
    background-color: #f0f0f0;
    text-align: center;
    font-weight: bold;
    height: 25px;
    width: 33.33%;
}

.tabla-validacion .valor-firma {
    height: 40px; 
    border-bottom: 1px solid #000;
}

.tabla-validacion .etiqueta-fecha {
    background-color: white;
    text-align: left;
    font-weight: bold;
    padding-top: 5px;
    border-top: none;
    border-bottom: none;
    padding-left: 10px;
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
    <table class="production-header">
        <tbody>
            <tr>
                <td class="section logo-area">
                    <div class="logo-container">
                        ${logoDataUrl ? `<img src="${logoDataUrl}" alt="logo" style="width: 80px;"/>` : ''}
                        <p class="logo-text">Laboratorios</p>
                    </div>
                </td>

                <td class="section center-area">
                    <div class="center-content">
                        <div class="top-row">
                            ${data.subtitle || 'Procedimiento de producción'}
                        </div>
                        <div class="main-title">
                            ${data.titulo || 'ORDEN DE PRODUCCIÓN'}
                        </div>
                    </div>
                </td>

                <td class="section info-area">
                    <div class="info-row">Código: ${data.codigo_header || 'F-QE-PR-001'}</div>
                    <div class="info-row">Revisión: ${data.revision || '1'}</div>
                    <div class="info-row">Fecha de emisión: ${data.fecha_emision || '19/10/2021'}</div>
                    <div class="info-row">Vigencia hasta: ${data.vigencia || '19/10/2024'}</div>
                    <div class="info-row page-number">Página: ${data.pagina || '1/2'}</div>
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
        </main>
</body>

    <main class="document-body">
        
        <div class="section-body">
            <div class="section-title">ORDEN DE PLANIFICACIÓN</div>
            <table class="tabla-general tabla-planificacion">
                <tr>
                    <td class="etiqueta">Nº Lote:</td>
                    <td class="valor">${data.nroLote || '0'}</td>
                    <td class="etiqueta descripcion-producto-label" colspan="2">Descripción Producto</td>
                    <td class="etiqueta status-label">Status:</td>
                </tr>
                <tr>
                    <td class="etiqueta">Orden:</td>
                    <td class="valor">${data.orden || '#N/D'}</td>
                    <td class="valor descripcion-producto-valor" colspan="2" rowspan="2">
                        ${data.descripcionProducto || '#N/D'}
                    </td>
                    <td class="status-circulo" rowspan="4"></td>
                </tr>
                <tr>
                    <td class="etiqueta">Código Producto:</td>
                    <td class="valor">${data.codigoProducto || '#N/D'}</td>
                </tr>
                <tr>
                    <td class="etiqueta">Fecha Emisión</td>
                    <td class="valor">${data.fechaEmision || '3/11/2025'}</td>
                    <td class="etiqueta registro-sanitario-label">Registro Sanitario:</td>
                    <td class="valor registro-sanitario-valor">${data.registroSanitario || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="etiqueta">Cantidad a Producir (Kg):</td>
                    <td class="valor cantidad-a-producir">${data.cantidadProducir || '#N/D'}</td>
                    <td class="valor nro-formula-info" colspan="2">Nro Fórmula: ${data.nroFormula || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="section-body">
            <div class="section-title">PRESENTACIONES</div>
            <table class="tabla-general tabla-presentaciones">
                <tr>
                    <td class="etiqueta orden-empaque-label">Orden de Empaque 1:</td>
                    <td class="valor orden-empaque-num">${data.ordenEmpaque1 || '0'}</td>
                    <td class="etiqueta presentacion-label">Presentación:</td>
                    <td class="valor presentacion-detalle">${data.presentacion1 || ''}</td>
                    <td class="etiqueta unidades-label">Unidades a Producir:</td>
                    <td class="valor unidades-num">${data.unidades1 || ''}</td>
                </tr>
                <tr>
                    <td class="etiqueta orden-empaque-label">Orden de Empaque 2:</td>
                    <td class="valor orden-empaque-num">${data.ordenEmpaque2 || ''}</td>
                    <td class="etiqueta presentacion-label">Presentación:</td>
                    <td class="valor presentacion-detalle">${data.presentacion2 || ''}</td>
                    <td class="etiqueta unidades-label">Unidades a Producir:</td>
                    <td class="valor unidades-num">${data.unidades2 || ''}</td>
                </tr>
                <tr>
                    <td class="etiqueta orden-empaque-label">Orden de Empaque 3:</td>
                    <td class="valor orden-empaque-num">${data.ordenEmpaque3 || ''}</td>
                    <td class="etiqueta presentacion-label">Presentación:</td>
                    <td class="valor presentacion-detalle">${data.presentacion3 || ''}</td>
                    <td class="etiqueta unidades-label">Unidades a Producir:</td>
                    <td class="valor unidades-num">${data.unidades3 || ''}</td>
                </tr>
            </table>
        </div>

        <div class="section-body">
            <div class="section-title">DESPEJE DE ÁREA DE PESADA</div>
            <p class="subtitulo-despeje">Verifique su conformidad o inconformidad (marque con una X)</p>
            <table class="tabla-general tabla-despeje">
                <thead>
                    <tr>
                        <th style="width: 5%;"></th>
                        <th style="width: 75%; text-align: left;"></th>
                        <th class="check-cell">Conforme</th>
                        <th class="check-cell">Inconforme</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="4" class="categoria">Medio Ambiente</td></tr>
                    <tr><td>1</td><td class="condicion">Pisos, paredes, ventanas, puertas, techos limpios y libre de polvo</td><td class="check-cell">${data.c_1 ? 'X' : ''}</td><td class="check-cell">${data.i_1 ? 'X' : ''}</td></tr>
                    <tr><td>2</td><td class="condicion">Iluminación adecuada</td><td class="check-cell">${data.c_2 ? 'X' : ''}</td><td class="check-cell">${data.i_2 ? 'X' : ''}</td></tr>
                    <tr><td>3</td><td class="condicion">Temperatura adecuada</td><td class="check-cell">${data.c_3 ? 'X' : ''}</td><td class="check-cell">${data.i_3 ? 'X' : ''}</td></tr>
                    <tr><td>4</td><td class="condicion">Ventilación adecuada</td><td class="check-cell">${data.c_4 ? 'X' : ''}</td><td class="check-cell">${data.i_4 ? 'X' : ''}</td></tr>
                </tbody>
                <tbody>
                    <tr><td colspan="2" class="categoria">Personal</td><td class="categoria check-cell">Conforme</td><td class="categoria check-cell">Inconforme</td></tr>
                    <tr><td>5</td><td class="condicion">Personal correctamente uniformado (Uniforme y Botas Seguridad)</td><td class="check-cell">${data.c_5 ? 'X' : ''}</td><td class="check-cell">${data.i_5 ? 'X' : ''}</td></tr>
                    <tr><td>6</td><td class="condicion">Uso de mascarilla</td><td class="check-cell">${data.c_6 ? 'X' : ''}</td><td class="check-cell">${data.i_6 ? 'X' : ''}</td></tr>
                    <tr><td>7</td><td class="condicion">Uso de tapones de seguridad</td><td class="check-cell">${data.c_7 ? 'X' : ''}</td><td class="check-cell">${data.i_7 ? 'X' : ''}</td></tr>
                    <tr><td>8</td><td class="condicion">Lentes de seguridad</td><td class="check-cell">${data.c_8 ? 'X' : ''}</td><td class="check-cell">${data.i_8 ? 'X' : ''}</td></tr>
                    <tr><td>9</td><td class="condicion">Guantes de nitrilo</td><td class="check-cell">${data.c_9 ? 'X' : ''}</td><td class="check-cell">${data.i_9 ? 'X' : ''}</td></tr>
                    <tr><td>10</td><td class="condicion">Higiene personal, manos y uñas</td><td class="check-cell">${data.c_10 ? 'X' : ''}</td><td class="check-cell">${data.i_10 ? 'X' : ''}</td></tr>
                    <tr><td>11</td><td class="condicion">Personal no utiliza ningún tipo de prendas (zarcillos, reloj, cadenas, etc)</td><td class="check-cell">${data.c_11 ? 'X' : ''}</td><td class="check-cell">${data.i_11 ? 'X' : ''}</td></tr>
                </tbody>
                <tbody>
                    <tr class="responsable-fila">
                        <td colspan="2" class="etiqueta">Responsable: ${data.responsable || ''}</td>
                        <td colspan="2" class="valor">Fecha: ${data.fechaResponsable || ''}</td>
                    </tr>
                </tbody>
            </table>

            <div class="observaciones-area">
                <p class="observaciones-label">Observaciones:</p>
                <div class="caja-observaciones">${data.observaciones || ''}</div>
            </div>
            
            <div class="footer-despeje">
                <span>${data.pieDespeje1 || '#N/D'}</span>
                <span>${data.pieDespeje2 || '#N/D'}</span>
            </div>
        </div>

        <div class="section-body">
            <div class="section-title">VALIDACIÓN</div>
            <table class="tabla-general tabla-validacion">
                <tr>
                    <td class="etiqueta">Producción</td>
                    <td class="etiqueta">Control de Calidad</td>
                    <td class="etiqueta">Director Técnico</td>
                </tr>
                <tr>
                    <td class="valor-firma"></td>
                    <td class="valor-firma"></td>
                    <td class="valor-firma"></td>
                </tr>
                <tr>
                    <td class="etiqueta-fecha">Fecha: ${data.fechaProduccion || ''}</td>
                    <td class="etiqueta-fecha">Fecha: ${data.fechaControlCalidad || ''}</td>
                    <td class="etiqueta-fecha">Fecha: ${data.fechaDirectorTecnico || ''}</td>
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

// ... (El resto del código asíncrono para Puppeteer se mantiene igual, PERO se cambia el formato) ...

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

        // Se usa req.body para poblar los datos
        const html = renderHtml(req.body || {}, logoDataUrl);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ 
            format: 'letter',  // Cambiado de 'A4' a 'letter'
            printBackground: true, 
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } 
        });

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