import { promises as fs } from 'fs';
import path from 'path';

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

const getStyles = () => `
<style>
    /* --- Configuración General --- */
    body {
        font-family: Arial, sans-serif;
        font-size: 8pt;
        margin: 0;
        background-color: #f4f4f4;
    }
    .document-container {
        width: 180mm;
        margin: 20px auto;
        border: 1.5px solid #000;
        background-color: #fff;
    }
    .main-table {
        width: 100%;
        border-collapse: collapse;
    }
    .main-table th,
    .main-table td {
        border: 1px solid #000;
        padding: 3px 5px;
        vertical-align: top;
        height: 1.2em;
    }
    .section-title {
        background-color: #d9d9d9;
        font-weight: bold;
        text-align: center;
        padding: 4px;
        border-top: 1px solid #000;
    }
    .label {
        font-weight: bold;
        font-size: 7pt;
        display: block;
    }
    .data {
        font-size: 9pt;
        font-weight: bold;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .no-border { border: none !important; }
    .no-border-top { border-top: none !important; }
    .no-border-bottom { border-bottom: none !important; }
    .border-right { border-right: 1px solid #000 !important; }

    /* --- Estilos de la Cabecera (copiados de orden.js) --- */
    .production-header {
        display: table;
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        border: 1px solid #000;
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
    .logo-area {
        width: 25%;
        height: 60px;
        text-align: center;
        padding: 5px;
        border-bottom: none !important;
    }
    .logo-container {
        padding-top: 5px;
    }
    .logo-text {
        font-size: 1.2em;
        font-weight: bold;
        color: #4CAF50;
    }
    .center-area {
        width: 50%;
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
        height: 15px;
        box-sizing: border-box;
    }
    .info-row:last-child {
        border-bottom: none;
    }
    .emitter-row {
        display: table-row;
    }
    .emitter-cell {
        padding: 5px;
        font-size: 0.8em;
        background-color: #f0f0f0;
        font-weight: bold;
        border: 1px solid #000;
    }
    
    /* 2. Planificación */
    .planificacion-table .data-large {
        font-size: 10pt;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
    }

    /* 3. Despeje de Área */
    .despeje-table th, .despeje-table td {
        font-size: 7pt;
        padding: 2px 4px;
        vertical-align: middle;
    }
    .despeje-table .item-desc {
        text-align: left;
        font-size: 7.5pt;
    }
    .despeje-table .label {
        font-size: 7pt;
        text-align: left;
        vertical-align: top;
        padding-top: 4px;
    }

    /* 6. Muestra Unitaria */
    .muestra-table td {
        height: 25px;
        text-align: center;
    }
    .muestra-table .label {
        font-size: 8pt;
        text-align: center;
    }

    /* 7 & 8. Resumen y Responsables */
    .summary-table td {
        height: 30px;
    }
    .responsible-table td {
        height: 40px;
        vertical-align: bottom;
        font-size: 7.5pt;
    }

    /* 9. Validación */
    .validation-table .label {
        text-align: center;
        font-size: 8pt;
    }
    .validation-table td {
        height: 45px;
        vertical-align: bottom;
        text-align: left;
    }
</style>
`;

const renderHtml = (data, logoDataUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Empaque</title>
    ${getStyles()}
</head>
<body>

    <div class="document-container">

        <table class="production-header">
            <tbody>
                <tr>
                    <td class="section logo-area">
                        <div class="logo-container">
                            ${logoDataUrl ? `<img src="${logoDataUrl}" alt="logo" style="width: 90%;"/>` : ''}
                        </div>
                    </td>

                    <td class="section center-area">
                        <div class="center-content">
                            <div class="top-row">
                                ${data.subtitle || 'Procedimiento de empaque'}
                            </div>
                            <div class="main-title">
                                ${data.titulo || 'ORDEN DE EMPAQUE'}
                            </div>
                        </div>
                    </td>

                    <td class="section info-area">
                        <div class="info-row">Código: ${data.codigo_header || 'F-MM-PR-041'}</div>
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

        <div class="section-title no-border-top">PRODUCTO TERMINADO</div>
        <div class="section-title no-border-top">ORDEN DE PLANIFICACIÓN</div>
        
        <table class="main-table planificacion-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 16%;"><span class="label">Nº Lote:</span><span class="data">${data.lote || '251119-1'}</span></td>
                    <td style="width: 16%;"><span class="label">Orden:</span><span class="data">${data.orden || '251119-1'}</span></td>
                    <td colspan="2" rowspan="3" class="data-large" style="width: 43%;">
                        <span class="label">Descripción Producto</span>
                        ${data.descripcion_producto || 'PIKOF MOSQUITOS ORGANICS SPLASH 120ML'}
                    </td>
                    <td style="width: 25%;"><span class="label">Fecha Empaque Est:</span><span class="data">${data.fecha_empaque_est || '11/11/2027'}</span></td>
                </tr>
                <tr>
                    <td><span class="label">Código Producto:</span><span class="data">${data.codigo_producto || 'PPM00600'}</span></td>
                    <td><span class="label">Fecha Emisión Orden:</span><span class="data">${data.fecha_emision_orden || '12/11/2025'}</span></td>
                    <td><span class="label">Fecha Vencimiento:</span><span class="data">${data.fecha_vencimiento || '11/11/2029'}</span></td>
                </tr>
                <tr>
                    <td colspan="2"><span class="label">Registro Sanitario:</span><span class="data">${data.registro_sanitario || ''}</span></td>
                    <td><span class="label">Unidades a Envasar:</span><span class="data">${data.unidades_a_envasar || '1500'}</span></td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">DESPEJE DE ÁREA DE EMPAQUE</div>
        <table class="main-table despeje-table no-border-top">
            <thead>
                <tr>
                    <th style="width: 3%;"></th>
                    <th class="text-left"><span class="label">Verifique su conformidad o inconformidad (marque con una X)</span></th>
                    <th style="width: 8%;"><span class="label">Conforme</span></th>
                    <th style="width: 8%;"><span class="label">Inconforme</span></th>
                    <th style="width: 25%;"><span class="label">RESPONSABLE</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">1</td>
                    <td class="item-desc">Líneas de despeje realizadas (producción y empaque)</td>
                    <td></td><td></td>
                    <td rowspan="2"></td>
                </tr>
                <tr>
                    <td class="text-center">2</td>
                    <td class="item-desc">Utensilios necesarios disponibles (espátulas, ollas, termómetro)</td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">3</td>
                    <td class="item-desc">Equipos Limpios con etiqueta que lo compruebe</td>
                    <td></td><td></td>
                    <td class="label">FECHA:</td>
                </tr>
                <tr>
                    <td class="text-center">4</td>
                    <td class="item-desc">Documentos del proceso disponibles y vigentes</td>
                    <td></td><td></td>
                    <td rowspan="3"></td>
                </tr>
                <tr>
                    <td class="text-center">5</td>
                    <td class="item-desc">Materiales de empaque e insumos disponibles y correctamente identificados</td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">6</td>
                    <td class="item-desc">No existen restos de producto fabricado anteriormente</td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">7</td>
                    <td class="item-desc">No existe documentación del producto fabricado anteriormente</td>
                    <td></td><td></td>
                    <td class="label">HORA:</td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">CONTROL DE PESO</div>
        <table class="main-table no-border-top text-center">
            <thead>
                <tr>
                    <th colspan="2">Límite Inferior Neto</th>
                    <th colspan="2">Valor Medio Neto</th>
                    <th colspan="2">Límite Superior Neto</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="width: 16.6%;"><span class="label">Valor Teórico</span><span class="data">${data.limite_inferior_teorico || '0'}</span></td>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span><br></td>
                    <td style="width: 16.6%;"><span class="label">Valor Teórico</span><span class="data">${data.valor_medio_teorico || '0'}</span></td>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span><br></td>
                    <td style="width: 16.6%;"><span class="label">Valor Teórico</span><span class="data">${data.limite_superior_teorico || '0'}</span></td>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span><br></td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">PESO DE ENVASES</div>
        <table class="main-table no-border-top">
            <tr>
                <td style="width: 16.6%; height: 25px;"></td>
                <td style="width: 16.6%;"></td>
                <td style="width: 16.6%;"></td>
                <td style="width: 16.6%;"></td>
                <td style="width: 16.6%;"></td>
                <td style="width: 16.6%;"></td>
            </tr>
        </table>
        <table class="main-table no-border-top">
            <tr>
                <td style="width: 50%;"><span class="label">PROMEDIO ENVASE $</span><br></td>
                <td style="width: 50%;"><span class="label">PESO BRUTO</span><br></td>
            </tr>
        </table>
        
        <div class="section-title">MUESTRA UNITARIA (PESO BRUTO EN GRAMOS)</div>
        <table class="main-table muestra-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 20%;"><span class="label">1</span></td>
                    <td style="width: 20%;"><span class="label">2</span></td>
                    <td style="width: 20%;"><span class="label">3</span></td>
                    <td style="width: 20%;"><span class="label">4</span></td>
                    <td style="width: 20%;"><span class="label">5</span></td>
                </tr>
                <tr>
                    <td><span class="label">6</span></td> <td><span class="label">7</span></td> <td><span class="label">8</span></td> <td><span class="label">9</span></td> <td><span class="label">10</span></td>
                </tr>
                <tr>
                    <td><span class="label">11</span></td> <td><span class="label">12</span></td> <td><span class="label">13</span></td> <td><span class="label">14</span></td> <td><span class="label">15</span></td>
                </tr>
                <tr>
                    <td><span class="label">16</span></td> <td><span class="label">17</span></td> <td><span class="label">18</span></td> <td><span class="label">19</span></td> <td><span class="label">20</span></td>
                </tr>
                <tr>
                    <td><span class="label">21</span></td> <td><span class="label">22</span></td> <td><span class="label">23</span></td> <td><span class="label">24</span></td> <td><span class="label">25</span></td>
                </tr>
                <tr>
                    <td><span class="label">26</span></td> <td><span class="label">27</span></td> <td><span class="label">28</span></td> <td><span class="label">29</span></td> <td><span class="label">30</span></td>
                </tr>
                <tr>
                    <td><span class="label">31</span></td> <td><span class="label">32</span></td> <td><span class="label">33</span></td> <td><span class="label">34</span></td> <td><span class="label">35</span></td>
                </tr>
            </tbody>
        </table>

        <table class="main-table summary-table">
            <tbody>
                <tr>
                    <td style="width: 25%;"><span class="label">Peso Promedio Contenido Neto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Peso Promedio Contenido Bruto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Desviación Estándar Contenido Neto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Desviación Estándar Contenido Bruto:</span><br></td>
                </tr>
            </tbody>
        </table>

        <table class="main-table responsible-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 50%;"><span class="label">Responsable Control de Calidad</span><br><br><span class="label">Fecha:</span></td>
                    <td style="width: 50%;"><span class="label">Responsable Contenido Bruto:</span><br><br><span class="label">Fecha:</span></td>
                </tr>
            </tbody>
        </table>
        
        <div class="section-title">VALIDACIÓN</div>
        <table class="main-table validation-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 33.3%;">
                        <span class="label">Lider de Producción</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                    <td style="width: 33.3%;">
                        <span class="label">Jefe de Producción</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                    <td style="width: 33.3%;">
                        <span class="label">Control de Calidad</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div> </body>
</html>
`;

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
        if (!data.fecha_emision_orden) {
            data.fecha_emision_orden = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        if (!data.fecha_emision) {
            data.fecha_emision = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }


        const html = renderHtml(data, logoDataUrl);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ 
            format: 'letter',
            printBackground: true, 
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=empaque.pdf');
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